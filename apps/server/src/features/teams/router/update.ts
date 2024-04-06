import { authenticatedProcedure } from "@/trpc";
import { updateTeamInputSchema } from "@sweetreply/shared/schemas/teams";
import { teamsService } from "../teams.service";
import { TRPCError } from "@trpc/server";

export const updateTeamHandler = authenticatedProcedure
	.input(updateTeamInputSchema)
	.mutation(async ({ input, ctx }) => {
		const ability = await teamsService.defineAbilitiesForTeamMember({
			teamId: input.id,
			userId: ctx.user.id,
		});

		const userCanUpdateTeam = ability.can("update", "team");

		if (!userCanUpdateTeam) {
			throw new TRPCError({
				code: "FORBIDDEN",
				message: "You cannot update this team",
			});
		}

		return ctx.prisma.team.update({
			data: input.data,
			where: {
				id: input.id,
			},
		});
	});
