import { adminProcedure } from "@admin/procedures";
import { z } from "zod";

const deleteSessionsInputSchema = z.object({
	userId: z.string(),
});

export const deleteSessionsHandler = adminProcedure
	.input(deleteSessionsInputSchema)
	.mutation(async ({ input, ctx }) => {
		await ctx.authService.deleteUserSessions(input.userId);
	});
