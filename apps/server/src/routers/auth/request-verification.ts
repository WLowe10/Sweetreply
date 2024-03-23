import { authenticatedUnverifiedProcedure } from "@/trpc";
import { TRPCError } from "@trpc/server";

export const requestVerificationHandler = authenticatedUnverifiedProcedure.mutation(async ({ ctx }) => {
	if (ctx.user.verified_at) {
		throw new TRPCError({
			code: "FORBIDDEN",
			message: "Your account is already verified",
		});
	}

	await ctx.authService.dispatchVerification(ctx.user.id);
});
