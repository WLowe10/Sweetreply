import { SESSION_ID_TOKEN } from "@/lib/auth/constants";
import { prisma } from "@/lib/db";
import { User } from "@replyon/prisma";
import argon2 from "argon2";
import type { Request } from "express";

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

	public createSession() {}
}

export const authService = new AuthService();
