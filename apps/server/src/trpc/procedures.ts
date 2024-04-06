import { trpc } from "./trpc";
import { authMiddleware } from "./middleware";
import { UserRole } from "@sweetreply/prisma";
import { alreadySignedIn, mustBeAdmin, mustBeVerified } from "../auth/errors";

// base procedure
export const publicProcedure = trpc.procedure;

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
	if (ctx.user.role !== UserRole.admin) {
		throw mustBeAdmin();
	}

	return next();
});
