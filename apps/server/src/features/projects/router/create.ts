import { authenticatedProcedure } from "@features/auth/procedures";
import { createProjectInputSchema } from "@sweetreply/shared/features/projects/schemas";
import { TRPCError } from "@trpc/server";

export const createProjectHandler = authenticatedProcedure
	.input(createProjectInputSchema)
	.mutation(async ({ input, ctx }) => {
		const projectCount = await ctx.prisma.project.count({
			where: {
				user_id: ctx.user.id,
			},
		});

		if (projectCount >= 10) {
			throw new TRPCError({
				code: "FORBIDDEN",
				message: "You cannot create more than 10 projects",
			});
		}

		return ctx.prisma.project.create({
			data: {
				user_id: ctx.user.id,
				name: input.name,
				description: input.description,
				website_url: input.website_url,
				reply_daily_limit: 5,
			},
		});
	});
