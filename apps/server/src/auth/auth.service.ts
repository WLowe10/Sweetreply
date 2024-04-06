/**
 * Don't touch this service unless you have a valid reason to!
 * A lot of work went into studying authentication to arrive at this point
 *
 * - Wes Lowe
 */

import jwt from "jsonwebtoken";
import argon2 from "argon2";
import { prisma } from "@/lib/db";
import { emailService } from "../email";
import { nanoid } from "nanoid";
import { ok, err, type ResultAsync, Result } from "@sweetreply/shared/lib/result";
import { emailAlreadyRegistered } from "./errors";
import { env } from "@/env";
import { stripe } from "@/lib/client/stripe";
import { TRPCError } from "@trpc/server";
import { isDev } from "@/lib/utils";
import { UserRole, type Session, type User } from "@sweetreply/prisma";
import type { SignUpType, SignInType } from "@sweetreply/shared/schemas/auth";
import type { Request, Response } from "express";

type EmailVerificationTokenPayloadType = { user_id: string };

export const authConstants = {
	SESSION_ID_TOKEN: "sid",
	SESSION_EXPIRATION: 1000 * 60 * 60 * 24 * 7, // 1 week
	PASSWORD_RESET_EXPIRATION: 1000 * 60 * 60, // 1 hour
	ACCOUNT_VERIFICATION_EXPIRATION: 1000 * 60 * 60, // 1 hour
	EMAIL_COOLDOWN: 1000 * 60 * 5, // 5 minutes
} as const;

const expirationDate = (expirationMs: number) => new Date(Date.now() + expirationMs);
const cooldownDate = (cooldownMs: number) => new Date(Date.now() - cooldownMs);

export class AuthService {
	/**
	 * Retrieve user by ID.
	 * @param userId - The ID of the user.
	 * @returns A Promise resolving to the user, or null if not found.
	 */
	public getUser(userId: string): Promise<User | null> {
		return prisma.user.findUnique({
			where: {
				id: userId,
			},
		});
	}

	/**
	 * Retrieve user by their email.
	 * @param email - The email of the user.
	 * @returns A Promise resolving to the user, or null if not found.
	 */
	public async getUserByEmail(email: string): Promise<User | null> {
		const normalizedEmail = email.toLowerCase();

		return await prisma.user.findUnique({
			where: {
				email: normalizedEmail,
			},
		});
	}

	/**
	 * Updates user by their id.
	 * @param id - The id of the user.
	 * @param data - The data to update.
	 * @returns A Promise resolving to the updated user, or null if not found.
	 */
	public updateUser(id: string, data: Partial<User>): Promise<User | null> {
		return prisma.user.update({
			where: {
				id,
			},
			data,
		});
	}

	/**
	 * Creates a new user if possible and sends a welcome email
	 * @param data - The registration data of the new user.
	 * @returns A Promise resolving to the user
	 */
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

		// create the stripe customer for subscriptions
		const stripeCustomer = await stripe.customers.create({
			email: normalizedEmail,
		});

		const hashedPassword = await argon2.hash(data.password);

		const newUser = await prisma.user.create({
			data: {
				email: normalizedEmail,
				password_hash: hashedPassword,
				first_name: data.first_name,
				last_name: data.last_name,
				stripe_customer_id: stripeCustomer.id,
			},
		});

		const verificationToken = this.createEmailVerificationToken(newUser.id);

		await emailService.sendWelcome({
			to: data.email,
			data: {
				firstName: data.first_name,
				verificationToken,
			},
		});

		return newUser;
	}

	/**
	 * Retrieve a session by the ID
	 * @param sessionId - The ID of the session
	 * @returns A Promise resolving to the session, or null if not found
	 */
	public getSession(sessionId: string): Promise<Session | null> {
		return prisma.session.findUnique({
			where: {
				id: sessionId,
			},
		});
	}

	/**
	 * Creates a new session for a user.
	 * @param userId - The id of the user.
	 * @returns A Promise resolving to the new session
	 */
	public createSessionForUser(userId: string): Promise<Session> {
		const expiresAt = expirationDate(authConstants.SESSION_EXPIRATION);

		return prisma.session.create({
			data: {
				user_id: userId,
				expires_at: expiresAt,
			},
		});
	}

	/**
	 * Updates session by its id.
	 * @param sessionId - The id of the user.
	 * @param data - The data to update.
	 * @returns A Promise resolving to the updated session, or null if not found.
	 */
	public updateSession(sessionId: string, data: Partial<Session>): Promise<Session | null> {
		return prisma.session.update({
			where: {
				id: sessionId,
			},
			data,
		});
	}

	/**
	 * Deletes a session
	 * @param sessionId - The id of the session.
	 */
	public async deleteSession(sessionId: string): Promise<void> {
		await prisma.session.delete({
			where: {
				id: sessionId,
			},
		});
	}

	/**
	 * Deletes all of a user's session
	 * @param userId - The id of user.
	 */
	public async deleteUserSessions(userId: string): Promise<void> {
		await prisma.session.deleteMany({
			where: {
				user_id: userId,
			},
		});
	}

	/**
	 * Deletes all sessions that are expired
	 */
	public async deleteExpiredSessions(): Promise<void> {
		await prisma.session.deleteMany({
			where: {
				expires_at: {
					lte: new Date(),
				},
			},
		});
	}

	/**
	 * Validates a session, either renwing it or deleting it if it's expired
	 * @param sessionId
	 * @returns A Promise result resolving to the user and session
	 */
	public async validateSession(
		sessionId: string
	): ResultAsync<{ user: User; session: Session }, null> {
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

		const updatedSession = await this.updateSession(session.id, {
			expires_at: expirationDate(authConstants.SESSION_EXPIRATION),
		});

		if (!updatedSession) {
			return err(null);
		}

		return ok({ user, session: updatedSession });
	}

	/**
	 * Sends a password reset email
	 * @param userId The user to send the email to
	 * @param opts Options
	 */
	public async dispatchPasswordReset(
		userId: string,
		opts?: { ignoreRateLimit: boolean }
	): Promise<void> {
		const user = await this.getUser(userId);

		if (!user) {
			return;
		}

		if (!opts?.ignoreRateLimit && user.password_reset_requested_at) {
			if (user.password_reset_requested_at) {
				if (user.password_reset_requested_at > cooldownDate(authConstants.EMAIL_COOLDOWN)) {
					throw new TRPCError({
						code: "TOO_MANY_REQUESTS",
						message: "You can only request a password reset once every 5 minutes",
					});
				}
			}
		}

		const expiresAt = expirationDate(authConstants.PASSWORD_RESET_EXPIRATION);

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

	/**
	 * Sends an account verification email
	 * @param userId The user to send the email to
	 * @param opts Options
	 */
	public async dispatchVerification(
		userId: string,
		opts?: { ignoreRateLimit: boolean }
	): Promise<void> {
		const user = await this.getUser(userId);

		if (!user) {
			return;
		}

		if (!opts?.ignoreRateLimit) {
			if (user.verification_requested_at) {
				if (user.verification_requested_at > cooldownDate(authConstants.EMAIL_COOLDOWN)) {
					throw new TRPCError({
						code: "TOO_MANY_REQUESTS",
						message: "You can only request a verification email once every 5 minutes",
					});
				}
			}
		}

		const verificationToken = this.createEmailVerificationToken(userId);

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

	/**
	 * Changes the password of a user and deletes their old sessions
	 * @param code The password reset code
	 * @param newPassword The new password
	 * @returns The updated user
	 */
	public async changePassword(code: string, newPassword: string): Promise<User | null> {
		const user = await prisma.user.findUnique({
			where: {
				password_reset_code: code,
				password_reset_code_expires_at: {
					not: null,
				},
			},
		});

		if (!user) {
			throw new TRPCError({
				code: "BAD_REQUEST",
				message: "Invalid password reset code",
			});
		}

		// @ts-ignore
		if (user.password_reset_code_expires_at < new Date()) {
			throw new TRPCError({
				code: "BAD_REQUEST",
				message: "Password expiration expired, please request a new one",
			});
		}

		const passwordIsSame = await argon2.verify(user.password_hash, newPassword);

		if (passwordIsSame) {
			throw new TRPCError({
				code: "BAD_REQUEST",
				message: "Your password cannot be the same as your old password",
			});
		}

		await this.deleteUserSessions(user.id);

		return this.updateUser(user.id, {
			password_hash: await argon2.hash(newPassword),
			password_reset_code: null,
			password_reset_code_expires_at: null,
		});
	}

	/**
	 * Verifies a user's account
	 * @param userId The user to verify
	 * @returns The updated user
	 */
	public verifyUser(userId: string): Promise<User | null> {
		return this.updateUser(userId, {
			verified_at: new Date(),
		});
	}

	/**
	 * Creates an email verification token
	 * @param userId The user ID to create the token for
	 * @returns email verification JWT
	 */
	public createEmailVerificationToken(userId: string): string {
		return jwt.sign(
			{ user_id: userId } as EmailVerificationTokenPayloadType,
			env.EMAIL_VERIFICATION_SECRET,
			{
				expiresIn: authConstants.ACCOUNT_VERIFICATION_EXPIRATION,
			}
		);
	}

	/**
	 * Validates an email verification token
	 * @param token The token to validate
	 * @returns boolean
	 */
	public validateEmailVerificationToken(
		token: string
	): Result<EmailVerificationTokenPayloadType, null> {
		try {
			const decoded = jwt.verify(token, env.EMAIL_VERIFICATION_SECRET);
			return ok(decoded as EmailVerificationTokenPayloadType);
		} catch {
			return err(null);
		}
	}

	// --- helpers ---

	/**
	 * Gets user from request
	 * @param req The request object
	 * @returns The user if found, otherwise null
	 */
	public async getUserFromRequest(req: Request): Promise<User | null> {
		const sessionId = this.getSessionIdFromRequest(req);

		if (!sessionId) {
			return null;
		}

		const session = await this.getSession(sessionId);

		if (!session) {
			return null;
		}

		return this.getUser(session.user_id);
	}

	/**
	 * Validates a request. Internally wraps validateSession
	 * @param req The request object
	 * @returns A result containing the user and session
	 */
	public async validateRequest(
		req: Request,
		res: Response
	): ResultAsync<{ user: User; session: Session }, null> {
		const sessionId = this.getSessionIdFromRequest(req);

		if (!sessionId) {
			return err(null);
		}

		const sessionResult = await this.validateSession(sessionId);

		if (sessionResult.success) {
			// refresh the session cookie
			this.sendSessionCookie(res, sessionResult.data.session);
		} else {
			// delete the session cookie for the expired session
			this.sendBlankSessionCookie(res);
		}

		return sessionResult;
	}

	/**
	 * Validates a sign-in payload.
	 * @param data The sign-in payload
	 * @returns The user if validated, otherwise null
	 */
	public async validateSignIn(data: SignInType): Promise<User | null> {
		const user = await this.getUserByEmail(data.email);

		if (!user) {
			return null;
		}

		const passwordMatch = await argon2.verify(user.password_hash, data.password);

		if (!passwordMatch) {
			return null;
		}

		return user;
	}

	/**
	 * Gets the session id from a request object
	 * @param req The request object
	 * @returns The session id if found
	 */
	public getSessionIdFromRequest(req: Request): string | undefined {
		return req.signedCookies[authConstants.SESSION_ID_TOKEN];
	}

	/**
	 * Attaches a new session cookie to a response
	 * @param res The response object
	 */
	public sendSessionCookie(res: Response, session: Session): void {
		res.cookie(authConstants.SESSION_ID_TOKEN, session.id, {
			maxAge: authConstants.SESSION_EXPIRATION,
			signed: true,
			// todo domain
			httpOnly: true,
			secure: !isDev(),
			expires: session.expires_at,
			sameSite: "strict",
		});
	}

	/**
	 * Clears a session cookie
	 * @param res The response object
	 */
	public sendBlankSessionCookie(res: Response): void {
		res.clearCookie(authConstants.SESSION_ID_TOKEN);
	}
}

export const authService = new AuthService();
