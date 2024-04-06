import { authenticatedProcedure } from "@/trpc";

export const getManyTeamsHandler = authenticatedProcedure.query(({ ctx }) => {
	// todo validate auth

	return ctx.prisma.team.findMany({
		select: {
			id: true,
			name: true,
		},
		where: {
			team_members: {
				some: {
					user_id: ctx.user.id,
				},
			},
		},
	});
});
