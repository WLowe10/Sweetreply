import { authenticatedProcedure } from "@/trpc";
import { baseProjectSchema } from "@sweetreply/shared/features/projects/schemas";
import { z } from "zod";
import { projectNotFound } from "../errors";

const getProjectInputSchema = z.object({
	id: baseProjectSchema.shape.id,
});

export const getProjectHandler = authenticatedProcedure
	.input(getProjectInputSchema)
	.query(async ({ input, ctx }) => {
		const userCanReadProject = await ctx.projectsService.userOwnsProject(ctx.user.id, input.id);

		if (!userCanReadProject) {
			throw projectNotFound();
		}

		return ctx.prisma.project.findFirst({
			select: {
				id: true,
				name: true,
				website_url: true,
				description: true,
				query: true,
				replies_enabled: true,
				custom_reply_instructions: true,
				webhook_url: true,
				updated_at: true,
				created_at: true,
			},
			where: {
				id: input.id,
				user_id: ctx.user.id,
			},
		});
	});
