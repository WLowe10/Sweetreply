import { authenticatedUnverifiedProcedure } from "@/trpc";
import { UserRole } from "@replyon/prisma";

export const requestPasswordResetHandler = authenticatedUnverifiedProcedure.mutation(async ({ ctx }) => {
	await ctx.authService.dispatchPasswordReset(ctx.user.id, {
		ignoreRateLimit: ctx.user.role === UserRole.admin,
	});
});
