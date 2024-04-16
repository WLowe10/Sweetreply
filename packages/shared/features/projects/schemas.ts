import { z } from "zod";
import { projectModel } from "@sweetreply/prisma/zod";

const subredditNameSchema = z
	.string()
	.min(3, {
		message: "The name of a subreddit cannot be less than 3 characters",
	})
	.max(21, {
		message: "The name of a subreddit cannot be longer than 21 characters",
	});

export const baseProjectSchema = projectModel.extend({
	id: z.string().uuid(),
	name: projectModel.shape.name.min(3).max(32),
	website_url: z.string().url().max(128),
	description: z.string().min(6).max(1024),
	query: z.string().max(512),
	custom_reply_instructions: z.string().max(512),
	reply_mention_mode: z.enum(["name", "name_or_url", "url"]),
	webhook_url: z.string().url().max(128),

	// todo prevent duplicates
	reddit_excluded_subreddits: z
		.array(subredditNameSchema)
		.max(10, { message: "You cannot exclude more than 10 subreddits" }),
	reddit_included_subreddits: z.array(subredditNameSchema).max(10, {
		message: "You cannot include more than 10 subreddits",
	}),
});

export const createProjectInputSchema = baseProjectSchema.pick({
	name: true,
});

export const updateProjectInputSchema = z.object({
	id: baseProjectSchema.shape.id,
	data: baseProjectSchema
		.pick({
			name: true,
			website_url: true,
			description: true,
			query: true,
			replies_enabled: true,
			reply_mention_mode: true,
			custom_reply_instructions: true,
			reddit_included_subreddits: true,
			reddit_excluded_subreddits: true,
			webhook_url: true,
		})
		.partial(),
});

export type CreateProjectInputType = z.infer<typeof createProjectInputSchema>;
export type UpdateProjectInputType = z.infer<typeof updateProjectInputSchema>;
