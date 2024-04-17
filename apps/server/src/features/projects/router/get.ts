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
		const userOwnsProject = await ctx.projectsService.userOwnsProject({
			userId: ctx.user.id,
			projectId: input.id,
		});

		if (!userOwnsProject) {
			throw projectNotFound();
		}

		return ctx.prisma.project.findFirst({
			select: {
				id: true,
				name: true,
				tokens: true,
				website_url: true,
				description: true,
				query: true,
				reply_mention_mode: true,
				custom_reply_instructions: true,
				reddit_monitor_enabled: true,
				reddit_replies_enabled: true,
				reddit_included_subreddits: true,
				reddit_excluded_subreddits: true,
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
