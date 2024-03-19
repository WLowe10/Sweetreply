import { prisma } from "../lib/db";
import { logger } from "../lib/logger";
import { authService } from "../services/auth";
import type { User } from "@replyon/prisma";
import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import type { Request, Response } from "express";

type CreateContextOptions = {
    req: Request;
    res: Response;
};

function createInnerContext(opts: CreateContextOptions) {
    return {
        req: opts.req,
        res: opts.res,
        logger,
        prisma,
        authService,
        user: null,
        session: null,
    };
}

export function createContext(
    opts: CreateExpressContextOptions
): ReturnType<typeof createInnerContext> {
    const { req, res } = opts;

    return createInnerContext({
        req,
        res,
    });
}
