import { unauthenticatedProcedure } from "@/trpc";
import { UserRole } from "@sweetreply/prisma";
import { forgotPasswordInputSchema } from "@sweetreply/shared/schemas/auth";

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
