import { authenticatedProcedure } from "@auth/procedures";
import { baseProjectSchema } from "@sweetreply/shared/features/projects/schemas";
import { z } from "zod";
import { projectNotFound } from "../errors";

const deleteProjectInputSchema = z.object({
	id: baseProjectSchema.shape.id,
});

export const deleteProjectHandler = authenticatedProcedure
	.input(deleteProjectInputSchema)
	.mutation(async ({ input, ctx }) => {
		const userOwnsProject = await ctx.projectsService.userOwnsProject({
			userId: ctx.user.id,
			projectId: input.id,
		});

		if (!userOwnsProject) {
			throw projectNotFound();
		}

		return ctx.prisma.project.delete({
			where: {
				id: input.id,
				user_id: ctx.user.id,
			},
		});
	});
