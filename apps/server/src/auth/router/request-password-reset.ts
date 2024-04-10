import { authenticatedUnverifiedProcedure } from "@/trpc";
import { UserRole } from "@sweetreply/prisma";

export const requestPasswordResetHandler = authenticatedUnverifiedProcedure.mutation(
	async ({ ctx }) => {
		await ctx.authService.dispatchPasswordReset(ctx.user.id);
	}
);
