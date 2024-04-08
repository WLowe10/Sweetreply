import { authenticatedProcedure } from "@/trpc";
import { createTeamInputSchema } from "@sweetreply/shared/features/teams/schemas";

export const createTeamHandler = authenticatedProcedure
	.input(createTeamInputSchema)
	.mutation(({ input, ctx }) => {
		// todo create stripe customer id, maybe should be stored on the user (owner of the team)

		return ctx.prisma.team.create({
			data: {
				stripe_customer_id: "",
				owner_id: ctx.user.id,
				name: input.name,
				team_members: {
					create: {
						user_id: ctx.user.id,
						joined_at: new Date(),
					},
				},
			},
		});
	});
