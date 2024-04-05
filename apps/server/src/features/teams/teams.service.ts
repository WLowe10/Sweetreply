import { defineAbility } from "@casl/ability";
import { prisma } from "@/lib/db";
import { TeamMemberRole } from "@replyon/prisma";
import { TRPCError } from "@trpc/server";
import { teamNotFound } from "./errors";

export class TeamsService {
	public async defineAbilitiesForTeamMember({
		teamId,
		userId,
	}: {
		teamId: string;
		userId: string;
	}) {
		const teamMember = await prisma.teamMember.findFirst({
			select: {
				role: true,
			},
			where: {
				user_id: userId,
				team_id: teamId,
			},
		});

		if (!teamMember) {
			throw teamNotFound();
		}

		return defineAbility((can, cannot) => {
			can("read", "team");

			if (teamMember.role === TeamMemberRole.owner) {
				can("read", "billing");
				can("update", "team");
				can("invite", "member");
				can("update", "member");
				can("remove", "member");
			}
		});
	}
}

export const teamsService = new TeamsService();
