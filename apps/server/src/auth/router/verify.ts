import { authenticatedUnverifiedProcedure } from "@/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

const verifyAccountInputSchema = z.object({
	token: z.string(),
});

export const verifyAccountHandler = authenticatedUnverifiedProcedure
	.input(verifyAccountInputSchema)
	.mutation(async ({ input, ctx }) => {
		const result = ctx.authService.validateEmailVerificationToken(input.token);

		if (!result.success) {
			throw new TRPCError({
				code: "BAD_REQUEST",
				message: "Invalid token. Please request a new verification email.",
			});
		}

		const updatedUser = await ctx.authService.verifyUser(result.data.user_id);

		if (!updatedUser) {
			throw new TRPCError({
				code: "INTERNAL_SERVER_ERROR",
				message: "Failed to verify.",
			});
		}

		if (updatedUser) {
			ctx.logger.info({
				id: updatedUser.id,
				email: updatedUser.email,
			});
		}

		return {
			verified_at: updatedUser.verified_at,
		};
	});
