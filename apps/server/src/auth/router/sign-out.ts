import { authenticatedUnverifiedProcedure } from "@auth/procedures";
import { z } from "zod";

const signOutInputSchema = z
	.object({
		all: z.boolean(),
	})
	.optional();

export const signOutHandler = authenticatedUnverifiedProcedure
	.input(signOutInputSchema)
	.mutation(async ({ input, ctx }) => {
		ctx.authService.sendBlankSessionCookie(ctx.res);

		if (input && input.all) {
			await ctx.authService.deleteUserSessions(ctx.user.id);
		} else {
			await ctx.authService.deleteSession(ctx.session.id);
		}
	});
