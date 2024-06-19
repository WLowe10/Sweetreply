import { adminProcedure } from "~/features/admin/procedures";
import { z } from "zod";

const sendPasswordResetInputSchema = z.object({
	userID: z.string(),
});

export const sendPasswordResetHandler = adminProcedure
	.input(sendPasswordResetInputSchema)
	.mutation(({ input, ctx }) => {
		return ctx.authService.dispatchPasswordReset(input.userID, {
			ignoreRateLimit: true,
		});
	});
