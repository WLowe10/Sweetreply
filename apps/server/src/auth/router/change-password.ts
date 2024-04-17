import { publicProcedure } from "@/trpc";
import { changePasswordInputSchema } from "@sweetreply/shared/features/auth/schemas";

export const changePasswordHandler = publicProcedure
	.input(changePasswordInputSchema)
	.mutation(async ({ input, ctx }) => {
		await ctx.authService.changePassword(input.code, input.new_password);
	});
