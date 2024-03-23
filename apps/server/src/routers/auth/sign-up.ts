import { unauthenticatedProcedure } from "@/trpc";
import { env } from "@/env";
import { TRPCError } from "@trpc/server";
import { signUpInputSchema } from "@replyon/shared/schemas/auth";

export const signUpHandler = unauthenticatedProcedure.input(signUpInputSchema).mutation(async ({ ctx, input }) => {
	if (env.AUTH_REGISTRATION_DISABLED) {
		throw new TRPCError({
			code: "FORBIDDEN",
			message: "Registration is currently disabled.",
		});
	}

	const user = await ctx.authService.registerUser(input);

	ctx.logger.info("User registered", { email: input.email });
});
