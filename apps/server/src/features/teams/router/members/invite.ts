import { authenticatedProcedure } from "@/trpc";
import { inviteTeamMemberInputSchema } from "@sweetreply/shared/schemas/teams";
import { TRPCError } from "@trpc/server";
import { teamsConstants } from "../../constants";

export const inviteTeamMemberHandler = authenticatedProcedure
	.input(inviteTeamMemberInputSchema)
	.mutation(async ({ input, ctx }) => {
		// todo verify user owns the team

		const team = await ctx.prisma.team.findFirst({
			where: {
				id: input.teamId,
			},
			select: {
				id: true,
				name: true,
				owner: {
					select: {
						email: true,
						first_name: true,
					},
				},
			},
		});

		if (!team) {
			throw new TRPCError({
				code: "NOT_FOUND",
				message: "TEMP",
			});
		}

		const userExists = await ctx.authService.getUserByEmail(input.userEmail);

		if (!userExists) {
			throw new TRPCError({
				code: "NOT_FOUND",
				message: "A user with this email address was not found",
			});
		}

		const teamMemberExists = await ctx.prisma.teamMember.findFirst({
			where: {
				team_id: input.teamId,
				user_id: userExists.id,
			},
		});

		if (teamMemberExists) {
			throw new TRPCError({
				code: "CONFLICT",
				message: "This user is already a member of your team",
			});
		}

		const teamMemberCount = await ctx.prisma.teamMember.count({
			where: {
				team_id: input.teamId,
				user_id: userExists.id,
			},
		});

		if (teamMemberCount >= teamsConstants.defaultSeatLimit) {
			throw new TRPCError({
				code: "FORBIDDEN",
				message: "Your team is full",
			});
		}

		const newMember = await ctx.prisma.teamMember.create({
			data: {
				team_id: input.teamId,
				user_id: userExists.id,
			},
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
		});

		await ctx.emailService.sendTeamInvitation({
			to: newMember.user.email,
			data: {
				teamId: team.id,
				teamName: team.name,
				inviteeName: userExists.first_name,
				inviterEmail: team.owner.email,
				inviterName: team.owner.first_name,
			},
		});

		return newMember;
	});
