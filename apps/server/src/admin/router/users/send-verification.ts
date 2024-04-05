import { adminProcedure } from "@/trpc";
import { z } from "zod";

const sendVerificationInputSchema = z.object({
	userId: z.string(),
});

export const sendVerificationHandler = adminProcedure.input(sendVerificationInputSchema).mutation(({ input, ctx }) => {
	return ctx.authService.dispatchVerification(input.userId, {
		ignoreRateLimit: true,
	});
});
