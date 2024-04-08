import { publicProcedure } from "@/trpc";
import { changePasswordInputSchema } from "@sweetreply/shared/schemas/auth";

export const changePasswordHandler = publicProcedure
	.input(changePasswordInputSchema)
	.mutation(async ({ input, ctx }) => {
		const { code } = input;

		await ctx.authService.changePassword(code, input.newPassword);
	});
