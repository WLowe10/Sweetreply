import { unauthenticatedProcedure } from "@/trpc";
import { env } from "@/env";
import { TRPCError } from "@trpc/server";
import { signUpInputSchema } from "@replyon/shared/schemas/auth";
import { serializeUser } from "@/lib/auth/utils";

export const signUpHandler = unauthenticatedProcedure.input(signUpInputSchema).mutation(async ({ ctx, input }) => {
	if (env.AUTH_REGISTRATION_DISABLED) {
		throw new TRPCError({
			code: "FORBIDDEN",
			message: "Registration is currently disabled.",
		});
	}

	const user = await ctx.authService.registerUser(input);
	const session = await ctx.authService.createSessionForUser(user.id);

	ctx.logger.info({ email: input.email }, "User signed up");

	ctx.authService.sendSessionCookie(ctx.res, session);

	return serializeUser(user);
});
