import { authenticatedProcedure } from "@/trpc";
import { baseTeamSchema } from "@replyon/shared/schemas/teams";
import { get } from "http";
import { z } from "zod";

const getManyTeamMembersInputSchema = z.object({
	id: baseTeamSchema.shape.id,
});

export const getManyTeamMembersHandler = authenticatedProcedure
	.input(getManyTeamMembersInputSchema)
	.query(({ input, ctx }) => {
		// add auth check

		return ctx.prisma.teamMember.findMany({
			select: {
				role: true,
				joined_at: true,
				user: {
					select: {
						id: true,
						first_name: true,
						last_name: true,
						email: true,
					},
				},
			},
			where: {
				team_id: input.id,
			},
		});
	});
