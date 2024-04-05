import { authenticatedProcedure } from "@/trpc";
import { baseTeamSchema } from "@replyon/shared/schemas/teams";
import { z } from "zod";

const leaveTeamInputSchema = z.object({
	id: baseTeamSchema.shape.id,
});

export const leaveTeamHandler = authenticatedProcedure
	.input(leaveTeamInputSchema)
	.mutation(async ({ input, ctx }) => {
		// todo make sure user is not the owner of the team

		await ctx.prisma.teamMember.delete({
			where: {
				team_id_user_id: {
					team_id: input.id,
					user_id: ctx.user!.id,
				},
			},
		});
	});
