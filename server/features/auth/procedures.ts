import { alreadySignedIn, mustBeVerified } from "~/features/auth/errors";
import { trpc, publicProcedure } from "~/lib/trpc";
import { authMiddleware } from "./middleware";

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
