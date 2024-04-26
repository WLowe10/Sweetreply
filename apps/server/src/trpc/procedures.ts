import { trpc } from "./trpc";
import { authMiddleware } from "./middleware";
import { alreadySignedIn, mustBeAdmin, mustBeVerified } from "../auth/errors";
import { RateLimiterMemory } from "rate-limiter-flexible";
import { TRPCError } from "@trpc/server";

const rateLimiter = new RateLimiterMemory({
	points: 1,
	duration: 60,
});

// base procedure
export const publicProcedure = trpc.procedure;

export const ratelimitedPublicProcedure = publicProcedure.use(async ({ ctx, next }) => {
	const ip = ctx.req.ip;

	try {
		const result = await rateLimiter.consume(ip as string);

		return next();
	} catch {
		throw new TRPCError({
			code: "TOO_MANY_REQUESTS",
			message: "Rate limit exceeded. Please try again later.",
		});
	}
});

// ensures that the requester is not authenticated
export const unauthenticatedProcedure = publicProcedure.use(
	trpc.middleware(async ({ ctx, next }) => {
		const user = await ctx.authService.getUserFromRequest(ctx.req);

		if (user) {
			throw alreadySignedIn();
		}

		return next();
	})
);

// ensures that the requester is authenticated and verified
export const authenticatedProcedure = publicProcedure.use(
	authMiddleware.unstable_pipe(({ ctx, next }) => {
		if (!ctx.user.verified_at) {
			throw mustBeVerified();
		}

		return next();
	})
);

// ensures that the requester is authenticated, but not necessarily verified
export const authenticatedUnverifiedProcedure = publicProcedure.use(authMiddleware);

// ensures that the user is an admin
export const adminProcedure = authenticatedProcedure.use(({ ctx, next }) => {
	if (ctx.user.role !== "admin") {
		throw mustBeAdmin();
	}

	return next();
});
