import { authenticatedProcedure } from "@/trpc";
import { baseTeamSchema } from "@replyon/shared/schemas/teams";
import { z } from "zod";

const getTeamInputSchema = z.object({
	id: baseTeamSchema.shape.id,
});

export const getTeamHandler = authenticatedProcedure
	.input(getTeamInputSchema)
	.mutation(({ input, ctx }) => {
		// todo validate auth

		return ctx.prisma.team.findFirst({
			select: {
				id: true,
				name: true,
			},
			where: {
				id: input.id,
			},
		});
	});
