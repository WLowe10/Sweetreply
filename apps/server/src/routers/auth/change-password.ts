import { authenticatedUnverifiedProcedure } from "@/trpc";
import { changePasswordInputSchema } from "@replyon/shared/schemas/auth";

export const changePasswordHandler = authenticatedUnverifiedProcedure
	.input(changePasswordInputSchema)
	.mutation(async ({ input, ctx }) => {
		const { code } = input;

		await ctx.authService.changePassword(code, input.newPassword);
	});
