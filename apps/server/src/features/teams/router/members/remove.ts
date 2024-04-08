import { authenticatedProcedure } from "@/trpc";
import { baseUserSchema } from "@sweetreply/shared/features/auth/schemas";
import { baseTeamSchema } from "@sweetreply/shared/features/teams/schemas";
import { z } from "zod";

const remoteTeamMemberInputSchema = z.object({
	teamId: baseTeamSchema.shape.id,
	userId: baseUserSchema.shape.id,
});

export const removeTeamMemberHandler = authenticatedProcedure
	.input(remoteTeamMemberInputSchema)
	.mutation(async ({ input, ctx }) => {
		// check to make sure user has team permissions

		await ctx.prisma.teamMember.delete({
			where: {
				team_id_user_id: {
					team_id: input.teamId,
					user_id: input.userId,
				},
			},
		});
	});
