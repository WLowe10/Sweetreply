import { adminProcedure } from "@admin/procedures";
import { z } from "zod";

const sendPasswordResetInputSchema = z.object({
	userId: z.string(),
});

export const sendPasswordResetHandler = adminProcedure
	.input(sendPasswordResetInputSchema)
	.mutation(({ input, ctx }) => {
		return ctx.authService.dispatchPasswordReset(input.userId, {
			ignoreRateLimit: true,
		});
	});
