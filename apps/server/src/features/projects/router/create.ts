import { authenticatedProcedure } from "@/trpc";
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

		if (projectCount >= 5) {
			throw new TRPCError({
				code: "FORBIDDEN",
				message: "You cannot create more than 5 projects",
			});
		}

		return ctx.prisma.project.create({
			data: {
				name: input.name,
				user_id: ctx.user.id,
			},
		});
	});
