import { authenticatedUnverifiedProcedure } from "~/features/auth/procedures";

export const requestPasswordResetHandler = authenticatedUnverifiedProcedure.mutation(
	async ({ ctx }) => {
		await ctx.authService.dispatchPasswordReset(ctx.user.id);
	}
);
