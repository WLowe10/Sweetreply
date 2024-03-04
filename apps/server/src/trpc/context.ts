import { logger } from "~/lib/logger";
import { AuthService } from "~/app/auth/auth.service";
import type { UserType } from "~/db";
import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import type { Request, Response } from "express";

export type ContextType = {
    req: Request;
    res: Response;
    logger: typeof logger;
    user: UserType | null;
    authService: AuthService;
};

export function createContext({
    req,
    res,
}: CreateExpressContextOptions): ContextType {
    return {
        req,
        res,
        logger,
        user: null,
        authService: new AuthService(),
    };
}
