import { adminProcedure } from "~/features/admin/procedures";
import { z } from "zod";

const sendVerificationInputSchema = z.object({
	userID: z.string(),
});

export const sendVerificationHandler = adminProcedure
	.input(sendVerificationInputSchema)
	.mutation(({ input, ctx }) => {
		return ctx.authService.dispatchVerification(input.userID, {
			ignoreRateLimit: true,
		});
	});
