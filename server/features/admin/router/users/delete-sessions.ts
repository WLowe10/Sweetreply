import { adminProcedure } from "~/features/admin/procedures";
import { z } from "zod";

const deleteSessionsInputSchema = z.object({
	userID: z.string(),
});

export const deleteSessionsHandler = adminProcedure
	.input(deleteSessionsInputSchema)
	.mutation(async ({ input, ctx }) => {
		await ctx.authService.deleteUserSessions(input.userID);
	});
