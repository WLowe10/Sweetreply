import { authenticatedProcedure } from "~/features/auth/procedures";
import { updateProjectInputSchema } from "../schemas";
import { projectNotFound } from "../errors";

export const updateProjectHandler = authenticatedProcedure
	.input(updateProjectInputSchema)
	.mutation(async ({ input, ctx }) => {
		const userOwnsProject = await ctx.projectsService.userOwnsProject({
			userID: ctx.user.id,
			projectID: input.id,
		});

		if (!userOwnsProject) {
			throw projectNotFound();
		}

		return ctx.prisma.project.update({
			where: {
				id: input.id,
			},
			data: input.data,
		});
	});
