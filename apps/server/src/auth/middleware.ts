import { mustBeSignedIn } from "@auth/errors";
import { trpc } from "@lib/trpc";

export const authMiddleware = trpc.middleware(async ({ ctx, next }) => {
	const result = await ctx.authService.validateRequest(ctx.req, ctx.res);

	if (!result.success) {
		throw mustBeSignedIn();
	}

	const { user, session } = result.data;

	return next({
		ctx: {
			user,
			session,
		},
	});
});
