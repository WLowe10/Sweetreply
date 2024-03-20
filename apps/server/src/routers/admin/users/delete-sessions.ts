import { adminProcedure } from "@/trpc";
import { z } from "zod";

const deleteSessionsInputSchema = z.object({
	userId: z.string(),
});

export const deleteSessionsHandler = adminProcedure.input(deleteSessionsInputSchema).mutation(({ input, ctx }) => {
	return ctx.authService.deleteUserSessions(input.userId);
});
