import { authenticatedProcedure } from "@/trpc";
import { updateProjectInputSchema } from "@sweetreply/shared/features/projects/schemas";
import { projectNotFound } from "../errors";

export const updateProjectHandler = authenticatedProcedure
	.input(updateProjectInputSchema)
	.mutation(async ({ input, ctx }) => {
		const userCanUpdateProject = await ctx.projectsService.userOwnsProject(
			ctx.user.id,
			input.id
		);

		if (!userCanUpdateProject) {
			throw projectNotFound();
		}

		return ctx.prisma.project.update({
			where: {
				id: input.id,
			},
			data: input.data,
		});
	});
