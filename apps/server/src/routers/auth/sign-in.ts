import { unauthenticatedProcedure } from "@/trpc";
import { TRPCError } from "@trpc/server";
import { signInInputSchema } from "@replyon/shared/schemas/auth";
import { serializeUser } from "@/lib/auth/utils";

export const signInHandler = unauthenticatedProcedure.input(signInInputSchema).mutation(async ({ input, ctx }) => {
	const { res } = ctx;

	const user = await ctx.authService.validateSignIn(input);

	if (!user) {
		throw new TRPCError({
			code: "BAD_REQUEST",
			message: "Invalid email or password.",
		});
	}

	const session = await ctx.authService.createSessionForUser(user.id);

	ctx.authService.sendSessionCookie(res, session);

	ctx.logger.info(
		{
			id: user.id,
			email: user.email,
		},
		"User signed in"
	);

	return serializeUser(user);
});
