import { mustBeSignedIn } from "~/lib/auth/errors";
import { trpc } from "./trpc";

export const authMiddleware = trpc.middleware(async ({ ctx, next }) => {
	const user = await ctx.authService.getUserFromRequest(ctx.req);

	if (!user) {
		throw mustBeSignedIn();
	}

	return next({
		ctx: {
			user,
		},
	});
});
