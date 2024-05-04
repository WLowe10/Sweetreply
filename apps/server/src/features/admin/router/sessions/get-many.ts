import { authenticatedProcedure } from "@features/auth/procedures";
import { z } from "zod";

const getManySessionsInputSchema = z.object({
	userID: z.string(),
});

export const getManySessionsHandler = authenticatedProcedure
	.input(getManySessionsInputSchema)
	.mutation(async ({ input, ctx }) => {
		return ctx.prisma.session.findMany({
			where: {
				user_id: input.userID,
			},
		});
	});
