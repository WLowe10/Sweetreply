import { mustBeSignedIn } from "@/lib/auth/errors";
import { trpc } from "./trpc";

export const authMiddleware = trpc.middleware(async ({ ctx, next }) => {
	const result = await ctx.authService.validateRequest(ctx.req);

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
