import { authenticatedUnverifiedProcedure } from "@/trpc";

export const requestPasswordResetHandler = authenticatedUnverifiedProcedure.mutation(
	async ({ ctx }) => {
		await ctx.authService.dispatchPasswordReset(ctx.user.id);
	}
);
