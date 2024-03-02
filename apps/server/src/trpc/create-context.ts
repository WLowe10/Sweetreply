import { db } from "@/db";
import { logger } from "@/lib/logger";
import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import type { Request, Response } from "express";

export type ContextType = {
    req: Request;
    res: Response;
    db: typeof db;
    logger: typeof logger;
};

export function createContext({
    req,
    res,
}: CreateExpressContextOptions): ContextType {
    return {
        req,
        res,
        db,
        logger,
    };
}
