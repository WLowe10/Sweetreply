import { alreadyVerified } from "@/lib/auth/errors";
import { authenticatedUnverifiedProcedure } from "@/trpc";
import { UserRole } from "@replyon/prisma";

export const requestVerificationHandler = authenticatedUnverifiedProcedure.mutation(async ({ ctx }) => {
	if (ctx.user.verified_at) {
		throw alreadyVerified();
	}

	await ctx.authService.dispatchVerification(ctx.user.id, {
		ignoreRateLimit: ctx.user.role === UserRole.admin,
	});
});
