import { alreadyVerified } from "../errors";
import { authenticatedUnverifiedProcedure } from "@/trpc";

export const requestVerificationHandler = authenticatedUnverifiedProcedure.mutation(
	async ({ ctx }) => {
		if (ctx.user.verified_at) {
			throw alreadyVerified();
		}

		await ctx.authService.dispatchVerification(ctx.user.id);
	}
);
