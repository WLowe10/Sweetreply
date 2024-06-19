import { alreadyVerified } from "../errors";
import { authenticatedUnverifiedProcedure } from "~/features/auth/procedures";

export const requestVerificationHandler = authenticatedUnverifiedProcedure.mutation(
	async ({ ctx }) => {
		if (ctx.user.verified_at) {
			throw alreadyVerified();
		}

		await ctx.authService.dispatchVerification(ctx.user.id);
	}
);
