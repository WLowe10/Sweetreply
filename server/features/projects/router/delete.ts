import { z } from "zod";
import { authenticatedProcedure } from "~/features/auth/procedures";
import { baseProjectSchema } from "../schemas";
import { projectNotFound } from "../errors";

const deleteProjectInputSchema = z.object({
	id: baseProjectSchema.shape.id,
});

export const deleteProjectHandler = authenticatedProcedure
	.input(deleteProjectInputSchema)
	.mutation(async ({ input, ctx }) => {
		const userOwnsProject = await ctx.projectsService.userOwnsProject({
			userID: ctx.user.id,
			projectID: input.id,
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
