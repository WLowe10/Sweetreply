import { publicProcedure } from "@/trpc";
import { changePasswordInputSchema } from "@sweetreply/shared/features/auth/schemas";

export const changePasswordHandler = publicProcedure
	.input(changePasswordInputSchema)
	.mutation(async ({ input, ctx }) => {
		const { code } = input;

		await ctx.authService.changePassword(code, input.newPassword);
	});
