import { unauthenticatedProcedure } from "@/trpc";
import { forgotPasswordInputSchema } from "@sweetreply/shared/features/auth/schemas";

export const forgotPasswordHandler = unauthenticatedProcedure
	.input(forgotPasswordInputSchema)
	.mutation(async ({ input, ctx }) => {
		const user = await ctx.authService.getUserByEmail(input.email);

		if (user) {
			try {
				await ctx.authService.dispatchPasswordReset(user.id);
			} catch {
				// noop, there should be no feedback if the user exists or not
			}
		}
	});
