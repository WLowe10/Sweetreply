import { authConstants } from "@/lib/auth/constants";
import { prisma } from "@/lib/db";
import { emailService } from "./email";
import jwt from "jsonwebtoken";
import argon2 from "argon2";
import { nanoid } from "nanoid";
import { ok, err, type ResultAsync } from "@replyon/shared/lib/result";
import type { Session, User } from "@replyon/prisma";
import type { SignUpType } from "@replyon/shared/schemas/auth";
import type { Request } from "express";
import { emailAlreadyRegistered } from "@/lib/auth/errors";
import { env } from "@/env";
import { TRPCError } from "@trpc/server";

/**
 * Don't touch this service unless you have a valid reason to!
 * A lot of work went into studying authentication to arrive at this point
 *
 * - Wes Lowe
 */

export class AuthService {
	public getUser(userId: string): Promise<User | null> {
		return prisma.user.findUnique({
			where: {
				id: userId,
			},
		});
	}

	public async getUserByEmail(email: string): Promise<User | null> {
		return await prisma.user.findUnique({
			where: {
				email,
			},
		});
	}

	public updateUser(id: string, data: Partial<User>) {
		return prisma.user.update({
			where: {
				id,
			},
			data,
		});
	}

	public async registerUser(data: SignUpType): Promise<User> {
		const existingUser = await this.getUserByEmail(data.email);

		if (existingUser) {
			throw emailAlreadyRegistered();
		}

		const hashedPassword = await argon2.hash(data.password);

		const newUser = await prisma.user.create({
			data: {
				email: data.email,
				password_hash: hashedPassword,
				first_name: data.first_name,
				last_name: data.last_name,
				verification_requested_at: new Date(),
			},
		});

		await emailService.sendWelcome({
			to: data.email,
			data: {
				verifyCode: this.createEmailVerificationTokenForUser(newUser.id),
				firstName: data.first_name,
			},
		});

		return newUser;
	}

	public async getUserFromRequest(req: Request): Promise<User | null> {
		const sessionId = req.cookies[authConstants.SESSION_ID_TOKEN];

		if (!sessionId) {
			return null;
		}

		const session = await this.getSession(sessionId);

		if (!session) {
			return null;
		}

		return this.getUser(session.id);
	}

	public getSession(sessionId: string): Promise<Session | null> {
		return prisma.session.findUnique({
			where: {
				id: sessionId,
			},
		});
	}

	public updateSession(sessionId: string, data: Partial<Session>) {
		return prisma.session.update({
			where: {
				id: sessionId,
			},
			data,
		});
	}

	public createSessionForUser(userId: string): Promise<Session> {
		const expiresAt = new Date(Date.now() + authConstants.SESSION_EXPIRATION);

		return prisma.session.create({
			data: {
				user_id: userId,
				expires_at: expiresAt,
			},
		});
	}

	public async deleteSession(sessionId: string): Promise<void> {
		await prisma.session.delete({
			where: {
				id: sessionId,
			},
		});
	}

	public async deleteUserSessions(userId: string): Promise<void> {
		await prisma.session.deleteMany({
			where: {
				user_id: userId,
			},
		});
	}

	public async deleteExpiredSessions() {
		await prisma.session.deleteMany({
			where: {
				expires_at: {
					lte: new Date(),
				},
			},
		});
	}

	public async validateSession(sessionId: string): ResultAsync<{ user: User; session: Session }, null> {
		const session = await this.getSession(sessionId);

		if (!session) {
			return err(null);
		}

		if (session.expires_at < new Date()) {
			await this.deleteSession(sessionId);
			return err(null);
		}

		const user = await this.getUser(session.user_id);

		if (!user) {
			return err(null);
		}

		const updatedSession = await this.updateSession(sessionId, {
			expires_at: new Date(Date.now() + authConstants.SESSION_EXPIRATION),
		});

		return ok({ user, session: updatedSession });
	}

	public async validateRequest(req: Request): ResultAsync<{ user: User; session: Session }, null> {
		const sessionId = req.cookies[authConstants.SESSION_ID_TOKEN];

		if (!sessionId) {
			return err(null);
		}

		return this.validateSession(sessionId);
	}

	public async deleteExpiredPasswordResetCodes() {
		await prisma.user.updateMany({
			where: {
				password_reset_code_expires_at: {
					lte: new Date(),
				},
			},
			data: {
				password_reset_code: null,
			},
		});
	}

	public createEmailVerificationTokenForUser(userId: string): string {
		return jwt.sign({ user_id: userId }, env.EMAIL_VERIFICATION_SECRET, {
			expiresIn: authConstants.ACCOUNT_VERIFICATION_EXPIRATION,
		});
	}

	public validateEmailVerificationToken(token: string): boolean {
		try {
			jwt.verify(token, env.EMAIL_VERIFICATION_SECRET);

			return true;
		} catch {
			return false;
		}
	}

	public async dispatchPasswordReset(userId: string, opts?: { ignoreRateLimit: boolean }) {
		const user = await this.getUser(userId);

		if (!user) {
			return err(null);
		}

		if (!opts?.ignoreRateLimit && user.password_reset_requested_at) {
			if (user.password_reset_requested_at) {
				if (user.password_reset_requested_at > new Date(Date.now() - authConstants.EMAIL_COOLDOWN)) {
					throw new TRPCError({
						code: "TOO_MANY_REQUESTS",
						message: "You can only request a password reset once every 5 minutes",
					});
				}
			}
		}

		const expiresAt = new Date(Date.now() + authConstants.PASSWORD_RESET_EXPIRATION);

		const resetCode = nanoid(8);

		await this.updateUser(userId, {
			password_reset_code: resetCode,
			password_reset_code_expires_at: expiresAt,
			password_reset_requested_at: new Date(),
		});

		await emailService.sendPasswordReset({
			to: user.email,
			data: {
				resetCode,
			},
		});
	}

	public async dispatchVerification(userId: string, opts?: { ignoreRateLimit: boolean }) {
		const user = await this.getUser(userId);

		if (!user) {
			return;
		}

		if (!opts?.ignoreRateLimit) {
			if (user.verification_requested_at) {
				if (user.verification_requested_at > new Date(Date.now() - authConstants.EMAIL_COOLDOWN)) {
					throw new TRPCError({
						code: "TOO_MANY_REQUESTS",
						message: "You can only request a verification email once every 5 minutes",
					});
				}
			}
		}

		const resetCode = await this.createEmailVerificationTokenForUser(userId);

		await emailService.sendPasswordReset({
			to: user.email,
			data: {
				resetCode,
			},
		});
	}
}

export const authService = new AuthService();
