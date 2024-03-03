import { logger } from "@/lib/logger";
import type { UserType } from "@/db";
import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import type { Request, Response } from "express";

export type ContextType = {
    req: Request;
    res: Response;
    logger: typeof logger;
    user: UserType | null;
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
    };
}
