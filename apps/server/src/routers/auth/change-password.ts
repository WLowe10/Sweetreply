import { authenticatedUnverifiedProcedure } from "@/trpc";
import { z } from "zod";

const resetPasswordInputSchema = z.object({
	code: z.string(),
	newPassword: z.string(),
});

export const changePasswordHandler = authenticatedUnverifiedProcedure
	.input(resetPasswordInputSchema)
	.mutation(async ({ input, ctx }) => {
		const { code } = input;

		await ctx.authService.changePassword(code, input.newPassword);
	});
