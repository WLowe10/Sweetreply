import { prisma } from "~/lib/db";
import { User } from "@replyon/prisma";
import argon2 from "argon2";
import type { Request } from "express";

export class AuthService {
    public getUser(id: string): Promise<User | null> {
        return prisma.user.findUnique({
            where: {
                id: id,
            },
        });
    }

    public getUserFromRequest(req: Request): Promise<User | null> {
        const sessionId = req.cookies["sid"];

        return this.getUser("");
    }

    public createUser() {}

    public createSession() {}
}

export const authService = new AuthService();
