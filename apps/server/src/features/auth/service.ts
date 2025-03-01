/**
 * Don't touch this service unless you have a valid reason to!
 * A lot of work went into studying authentication to arrive at this point
 *
 * - Wes Lowe
 */

import jwt from "jsonwebtoken";
import argon2 from "argon2";
import { prisma } from "@lib/prisma";
import * as emailService from "../email/service";
import { nanoid } from "nanoid";
import { ok, err, type ResultAsync, Result } from "@sweetreply/shared/lib/result";
import { emailAlreadyRegistered } from "./errors";
import { env } from "@env";
import { stripe } from "@lib/client/stripe";
import { TRPCError } from "@trpc/server";
import { logger } from "@lib/logger";
import { sendDiscordNotification } from "@lib/discord-notification";
import {
	addMilliseconds,
	subMilliseconds,
	isAfter,
	isPast,
	minutesToMilliseconds,
	hoursToMilliseconds,
	millisecondsToMinutes,
} from "date-fns";
import { isDev } from "@sweetreply/shared/lib/utils";
import type { SignUpInputType, SignInInputType } from "@sweetreply/shared/features/auth/schemas";
import type { Session, User } from "@sweetreply/prisma";
import type { Request, Response } from "express";

type EmailVerificationTokenPayloadType = { user_id: string };

export const authConstants = {
	SESSION_ID_TOKEN: "sid",
	SESSION_EXPIRATION: hoursToMilliseconds(24 * 7),
	PASSWORD_RESET_EXPIRATION: hoursToMilliseconds(1),
	ACCOUNT_VERIFICATION_EXPIRATION: hoursToMilliseconds(1),
	EMAIL_COOLDOWN: minutesToMilliseconds(5),
} as const;

const expirationDate = (expirationMs: number) => addMilliseconds(new Date(), expirationMs);
const cooldownDate = (cooldownMs: number) => subMilliseconds(new Date(), cooldownMs);

/**
 * Retrieve user by ID.
 * @param userID - The ID of the user.
 * @returns A Promise resolving to the user, or null if not found.
 */
export function getUser(userID: string): Promise<User | null> {
	return prisma.user.findUnique({
		where: {
			id: userID,
		},
	});
}

/**
 * Retrieve user by their email.
 * @param email - The email of the user.
 * @returns A Promise resolving to the user, or null if not found.
 */
export async function getUserByEmail(email: string): Promise<User | null> {
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
export function updateUser(id: string, data: Partial<User>): Promise<User | null> {
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
export async function registerUser(data: SignUpInputType): Promise<User> {
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
		name: `${data.first_name} ${data.last_name}`,
	});

	const hashedPassword = await argon2.hash(data.password);

	const newUser = await prisma.user.create({
		data: {
			email: normalizedEmail,
			password_hash: hashedPassword,
			first_name: data.first_name,
			last_name: data.last_name,
			stripe_customer_id: stripeCustomer.id,
			verification_requested_at: new Date(),
		},
	});

	const verificationToken = createEmailVerificationToken(newUser.id);

	logger.info({ email: normalizedEmail }, "User signed up");

	try {
		await emailService.sendWelcome({
			to: data.email,
			data: {
				firstName: data.first_name,
				verificationToken,
			},
		});

		await sendDiscordNotification({
			title: "New sign up",
			description: "A new user signed up!",
			fields: [
				{
					name: "Name",
					value: `${newUser.first_name} ${newUser.last_name}`,
				},
				{
					name: "Email",
					value: newUser.email,
				},
			],
		});
	} catch {
		// noop
	}

	return newUser;
}

/**
 * Retrieve a session by the ID
 * @param sessionId - The ID of the session
 * @returns A Promise resolving to the session, or null if not found
 */
export function getSession(sessionId: string): Promise<Session | null> {
	return prisma.session.findUnique({
		where: {
			id: sessionId,
		},
	});
}

/**
 * Creates a new session for a user.
 * @param userID - The id of the user.
 * @returns A Promise resolving to the new session
 */
export function createSessionForUser(userID: string): Promise<Session> {
	const expiresAt = expirationDate(authConstants.SESSION_EXPIRATION);

	return prisma.session.create({
		data: {
			user_id: userID,
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
export function updateSession(sessionId: string, data: Partial<Session>): Promise<Session | null> {
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
export async function deleteSession(sessionId: string): Promise<void> {
	await prisma.session.delete({
		where: {
			id: sessionId,
		},
	});
}

/**
 * Deletes all of a user's session
 * @param userID - The id of user.
 */
export async function deleteUserSessions(userID: string): Promise<void> {
	await prisma.session.deleteMany({
		where: {
			user_id: userID,
		},
	});
}

/**
 * Deletes all sessions that are expired
 */
export async function deleteExpiredSessions(): Promise<void> {
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
export async function validateSession(
	sessionId: string
): ResultAsync<{ user: User; session: Session }, null> {
	const session = await getSession(sessionId);

	if (!session) {
		return err(null);
	}

	if (isPast(session.expires_at)) {
		await deleteSession(sessionId);

		return err(null);
	}

	const user = await getUser(session.user_id);

	if (!user) {
		return err(null);
	}

	const updatedSession = await updateSession(session.id, {
		expires_at: expirationDate(authConstants.SESSION_EXPIRATION),
	});

	if (!updatedSession) {
		return err(null);
	}

	return ok({ user, session: updatedSession });
}

/**
 * Sends a password reset email
 * @param userID The user to send the email to
 * @param opts Options
 */
export async function dispatchPasswordReset(
	userID: string,
	opts?: { ignoreRateLimit: boolean }
): Promise<void> {
	const user = await getUser(userID);

	if (!user) {
		return;
	}

	if (!opts?.ignoreRateLimit && user.password_reset_requested_at) {
		if (isAfter(user.password_reset_requested_at, cooldownDate(authConstants.EMAIL_COOLDOWN))) {
			throw new TRPCError({
				code: "TOO_MANY_REQUESTS",
				message: `You can only request a password reset once every ${millisecondsToMinutes(
					authConstants.EMAIL_COOLDOWN
				)} minutes`,
			});
		}
	}

	const expiresAt = expirationDate(authConstants.PASSWORD_RESET_EXPIRATION);

	// NanoID is used for the reset code, it looks better that a UUID in the url param
	// NanoID is a 21 length random string. This will protect against someone brute forcing password reset

	const resetCode = nanoid();

	await updateUser(userID, {
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
 * @param userID The user to send the email to
 * @param opts Options
 */
export async function dispatchVerification(
	userID: string,
	opts?: { ignoreRateLimit: boolean }
): Promise<void> {
	const user = await getUser(userID);

	if (!user) {
		return;
	}

	if (!opts?.ignoreRateLimit && user.verification_requested_at) {
		if (isAfter(user.verification_requested_at, cooldownDate(authConstants.EMAIL_COOLDOWN))) {
			throw new TRPCError({
				code: "TOO_MANY_REQUESTS",
				message: `You can only request a verification email once every ${millisecondsToMinutes(
					authConstants.EMAIL_COOLDOWN
				)} minutes`,
			});
		}
	}

	const verificationToken = createEmailVerificationToken(userID);

	await updateUser(userID, {
		verification_requested_at: new Date(),
	});

	await emailService.sendVerification({
		to: user.email,
		data: {
			verificationToken,
		},
	});
}

// ? consider making it optional to delete the sessions on PW change

/**
 * Changes the password of a user and deletes their old sessions
 * @param code The password reset code
 * @param newPassword The new password
 * @returns The updated user
 */
export async function changePassword(code: string, newPassword: string): Promise<User | null> {
	const user = await prisma.user.findUnique({
		where: {
			password_reset_code: code,
			password_reset_code_expires_at: {
				not: null,
			},
		},
	});

	if (!user || !user.password_reset_code_expires_at || !user.password_reset_code) {
		throw new TRPCError({
			code: "BAD_REQUEST",
			message: "Invalid password reset code",
		});
	}

	if (isPast(user.password_reset_code_expires_at)) {
		throw new TRPCError({
			code: "BAD_REQUEST",
			message: "Password reset expired, please request a new one",
		});
	}

	const passwordIsSame = await argon2.verify(user.password_hash, newPassword);

	if (passwordIsSame) {
		throw new TRPCError({
			code: "BAD_REQUEST",
			message: "Your password cannot be the same as your old password",
		});
	}

	const passwordHash = await argon2.hash(newPassword);

	const updatedUser = await updateUser(user.id, {
		password_hash: passwordHash,
		password_reset_code: null,
		password_reset_code_expires_at: null,
	});

	// delete sessions after the password is changed. This mechanism will delete any stolen sessions
	await deleteUserSessions(user.id);

	return updatedUser;
}

/**
 * Verifies a user's account.
 *
 * This is a separate method to allow admins to verify accounts
 * @param userID The user to verify
 * @returns The updated user
 */
export function verifyUser(userID: string): Promise<User | null> {
	return updateUser(userID, {
		verified_at: new Date(),
	});
}

/**
 * Creates an email verification token
 * @param userID The user ID to create the token for
 * @returns email verification JWT
 */
export function createEmailVerificationToken(userID: string): string {
	return jwt.sign(
		{ user_id: userID } as EmailVerificationTokenPayloadType,
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
export function validateEmailVerificationToken(
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
export async function getUserFromRequest(req: Request): Promise<User | null> {
	const sessionId = getSessionIdFromRequest(req);

	if (!sessionId) {
		return null;
	}

	const session = await getSession(sessionId);

	if (!session) {
		return null;
	}

	return getUser(session.user_id);
}

/**
 * Validates a request. Internally wraps validateSession
 * @param req The request object
 * @returns A result containing the user and session
 */
export async function validateRequest(
	req: Request,
	res: Response
): ResultAsync<{ user: User; session: Session }, null> {
	const sessionId = getSessionIdFromRequest(req);

	if (!sessionId) {
		return err(null);
	}

	const sessionResult = await validateSession(sessionId);

	if (sessionResult.success) {
		// refresh the session cookie
		sendSessionCookie(res, sessionResult.data.session);
	} else {
		// delete the session cookie for the expired session
		sendBlankSessionCookie(res);
	}

	return sessionResult;
}

/**
 * Validates a sign-in payload.
 * @param data The sign-in payload
 * @returns The user if validated, otherwise null
 */
export async function validateSignIn(data: SignInInputType): Promise<User | null> {
	const user = await getUserByEmail(data.email);

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
export function getSessionIdFromRequest(req: Request): string | undefined {
	return req.signedCookies[authConstants.SESSION_ID_TOKEN];
}

/**
 * Attaches a new session cookie to a response
 * @param res The response object
 */
export function sendSessionCookie(res: Response, session: Session): void {
	res.cookie(authConstants.SESSION_ID_TOKEN, session.id, {
		maxAge: authConstants.SESSION_EXPIRATION,
		signed: true,
		domain: "." + env.DOMAIN,
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
export function sendBlankSessionCookie(res: Response): void {
	res.clearCookie(authConstants.SESSION_ID_TOKEN);
}
