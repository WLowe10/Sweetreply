import { TRPCError } from "@trpc/server";
import { publicProcedure } from "./trpc";

export const protectedProcedure = publicProcedure.use(({ ctx, next }) => {
    const { req, res } = ctx;

    const isAuthenticated = true;

    if (!isAuthenticated) {
        throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Please sign in",
        });
    }

    return next({
        ctx: {
            user: {
                id: "1",
            },
        },
    });
});

export const unauthenticatedProcedure = publicProcedure.use(({ ctx, next }) => {
    return next();
});

export const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
    if (ctx.user.id !== "admin") {
        throw new TRPCError({
            code: "NOT_FOUND",
            message: "Not found",
        });
    }

    return next();
});
