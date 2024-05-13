import { authenticatedProcedure } from "@features/auth/procedures";
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
			userID: ctx.user.id,
			projectID: input.id,
		});

		if (!userOwnsProject) {
			throw projectNotFound();
		}

		return ctx.prisma.project.findFirst({
			select: {
				id: true,
				name: true,
				website_url: true,
				description: true,
				keywords: true,
				negative_keywords: true,
				reply_mention_mode: true,
				reply_with_domain: true,
				reply_delay: true,
				reply_daily_limit: true,
				reply_custom_instructions: true,
				reddit_monitor_enabled: true,
				reddit_allow_nsfw: true,
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
