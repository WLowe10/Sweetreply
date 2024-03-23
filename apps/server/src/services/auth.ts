/**
 * Don't touch this service unless you have a valid reason to!
 * A lot of work went into studying authentication to arrive at this point
 *
 * - Wes Lowe
 */

import jwt from "jsonwebtoken";
import argon2 from "argon2";
import { prisma } from "@/lib/db";
import { emailService } from "./email";
import { nanoid } from "nanoid";
import { ok, err, type ResultAsync } from "@replyon/shared/lib/result";
import { emailAlreadyRegistered } from "@/lib/auth/errors";
import { env } from "@/env";
import { TRPCError } from "@trpc/server";
import type { Session, User } from "@replyon/prisma";
import type { SignUpType, SignInType } from "@replyon/shared/schemas/auth";
import type { Request, Response } from "express";
import { isDev } from "@/lib/utils";

export const authConstants = {
	SESSION_ID_TOKEN: "sid",
	SESSION_EXPIRATION: 1000 * 60 * 60 * 24 * 14, // 14 days
	PASSWORD_RESET_EXPIRATION: 1000 * 60 * 60, // 1 hour
	ACCOUNT_VERIFICATION_EXPIRATION: 1000 * 60 * 60, // 1 hour
	EMAIL_COOLDOWN: 1000 * 60 * 5, // 5 minutes
} as const;

export class AuthService {
	public getUser(userId: string): Promise<User | null> {
		return prisma.user.findUnique({
			where: {
				id: userId,
			},
		});
	}

	public async getUserByEmail(email: string): Promise<User | null> {
		const normalizedEmail = email.toLowerCase();

		return await prisma.user.findUnique({
			where: {
				email: normalizedEmail,
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
		const normalizedEmail = data.email.toLowerCase();

		const existingUser = await prisma.user.findUnique({
			where: {
				email: normalizedEmail,
			},
			select: {
				id: true,
			},
		});

		if (existingUser) {
			throw emailAlreadyRegistered();
		}

		const hashedPassword = await argon2.hash(data.password);

		const newUser = await prisma.user.create({
			data: {
				email: normalizedEmail,
				password_hash: hashedPassword,
				first_name: data.first_name,
				last_name: data.last_name,
			},
		});

		const verificationToken = await jwt.sign({ user_id: newUser.id }, env.EMAIL_VERIFICATION_SECRET, {
			expiresIn: authConstants.ACCOUNT_VERIFICATION_EXPIRATION,
		});

		await emailService.sendWelcome({
			to: data.email,
			data: {
				firstName: data.first_name,
				verificationToken,
			},
		});

		return newUser;
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

		const verificationToken = await jwt.sign({ user_id: userId }, env.EMAIL_VERIFICATION_SECRET, {
			expiresIn: authConstants.ACCOUNT_VERIFICATION_EXPIRATION,
		});

		await this.updateUser(userId, {
			verification_requested_at: new Date(),
		});

		await emailService.sendVerification({
			to: user.email,
			data: {
				verificationToken,
			},
		});
	}

	// helpers

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

	public async validateRequest(req: Request): ResultAsync<{ user: User; session: Session }, null> {
		const sessionId = this.getSessionIdFromRequest(req);

		console.log(sessionId);

		if (!sessionId) {
			return err(null);
		}

		return this.validateSession(sessionId);
	}

	public async validateSignIn(data: SignInType): Promise<User | false> {
		const user = await this.getUserByEmail(data.email);

		if (!user) {
			return false;
		}

		const passwordMatch = await argon2.verify(user.password_hash, data.password);

		if (!passwordMatch) {
			return false;
		}

		return user;
	}

	public getSessionIdFromRequest(req: Request) {
		return req.signedCookies[authConstants.SESSION_ID_TOKEN];
	}

	public sendSessionCookie(res: Response, sessionId: string): void {
		res.cookie(authConstants.SESSION_ID_TOKEN, sessionId, {
			maxAge: authConstants.SESSION_EXPIRATION,
			signed: true,
			// domain
			httpOnly: true,
			secure: !isDev(),
			// expires:
			sameSite: "strict",
		});
	}

	public sendBlankSessionCookie(res: Response): void {
		res.clearCookie(authConstants.SESSION_ID_TOKEN);
	}
}

export const authService = new AuthService();
