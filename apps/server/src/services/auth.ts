import { SESSION_EXPIRATION, SESSION_ID_TOKEN } from "@/lib/auth/constants";
import { prisma } from "@/lib/db";
import { emailService } from "./email";
import argon2 from "argon2";
import { ok, err, type ResultAsync } from "@replyon/shared/lib/result";
import type { Session, User } from "@replyon/prisma";
import type { Request } from "express";

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

	public getUserByEmail(email: string): Promise<User | null> {
		return prisma.user.findUnique({
			where: {
				email,
			},
		});
	}

	public getUserFromRequest(req: Request): Promise<User | null> {
		const sessionId = req.cookies[SESSION_ID_TOKEN];

		return this.getUser("");
	}

	public updateUser(id: string, data: Partial<User>) {
		return prisma.user.update({
			where: {
				id,
			},
			data,
		});
	}

	public createUser(data: Partial<User>) {}

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
		const expiresAt = new Date(Date.now() + SESSION_EXPIRATION);

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

	public async deleteAllUserSessions(userId: string): Promise<void> {
		await prisma.session.deleteMany({
			where: {
				user_id: userId,
			},
		});
	}

	public async deleteAllExpiredSessions() {
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
			expires_at: new Date(Date.now() + SESSION_EXPIRATION),
		});

		return ok({ user, session: updatedSession });
	}

	public async dispatchPasswordReset(userId: string) {
		const user = await this.getUser(userId);

		if (!user) {
			return;
		}
	}
}

export const authService = new AuthService();
