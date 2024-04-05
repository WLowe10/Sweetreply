import { authenticatedProcedure } from "@/trpc";
import { TeamMemberRole } from "@replyon/prisma";
import { updateTeamMemberInputSchema } from "@replyon/shared/schemas/teams";
import { TRPCError } from "@trpc/server";

export const updateTeamMemberHandler = authenticatedProcedure
	.input(updateTeamMemberInputSchema)
	.mutation(({ input, ctx }) => {
		// validate current user auth

		if (input.userId === ctx.user.id) {
			throw new TRPCError({
				code: "FORBIDDEN",
				message: "You cannot update your own role",
			});
		}

		if (input.data.role === TeamMemberRole.owner) {
			throw new TRPCError({
				code: "FORBIDDEN",
				message: "You cannot make another user the owner",
			});
		}

		return ctx.prisma.teamMember.update({
			where: {
				team_id_user_id: {
					team_id: input.teamId,
					user_id: input.userId,
				},
			},
			data: input.data,
		});
	});
