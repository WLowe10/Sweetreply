import { authenticatedProcedure } from "@auth/procedures";
import { z } from "zod";

const getManySessionsInputSchema = z.object({
	userId: z.string(),
});

export const getManySessionsHandler = authenticatedProcedure
	.input(getManySessionsInputSchema)
	.mutation(async ({ input, ctx }) => {
		return ctx.prisma.session.findMany({
			where: {
				user_id: input.userId,
			},
		});
	});
