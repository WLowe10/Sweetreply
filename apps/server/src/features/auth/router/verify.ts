import { publicProcedure } from "@lib/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { alreadyVerified } from "../errors";

const verifyAccountInputSchema = z.object({
	token: z.string(),
});

export const verifyAccountHandler = publicProcedure
	.input(verifyAccountInputSchema)
	.mutation(async ({ input, ctx }) => {
		const result = ctx.authService.validateEmailVerificationToken(input.token);

		if (!result.success) {
			throw new TRPCError({
				code: "BAD_REQUEST",
				message: "Invalid token. Please request a new verification email.",
			});
		}

		const user = await ctx.prisma.user.findUnique({
			where: {
				id: result.data.user_id,
			},
		});

		if (!user) {
			throw new TRPCError({
				code: "INTERNAL_SERVER_ERROR",
				message: "Failed to verify.",
			});
		}

		if (user.verified_at) {
			throw alreadyVerified();
		}

		const updatedUser = await ctx.authService.verifyUser(result.data.user_id);

		if (!updatedUser) {
			throw new TRPCError({
				code: "INTERNAL_SERVER_ERROR",
				message: "Failed to verify.",
			});
		}

		return {
			verified_at: updatedUser.verified_at,
		};
	});
