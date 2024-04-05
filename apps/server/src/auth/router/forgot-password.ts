import { unauthenticatedProcedure } from "@/trpc";
import { UserRole } from "@replyon/prisma";
import { forgotPasswordInputSchema } from "@replyon/shared/schemas/auth";

export const forgotPasswordHandler = unauthenticatedProcedure
	.input(forgotPasswordInputSchema)
	.mutation(async ({ input, ctx }) => {
		const user = await ctx.authService.getUserByEmail(input.email);

		if (user) {
			await ctx.authService.dispatchPasswordReset(user.id, {
				ignoreRateLimit: user.role === UserRole.admin,
			});
		}
	});
