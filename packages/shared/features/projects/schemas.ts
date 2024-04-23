import { z } from "zod";
import { projectModel } from "@sweetreply/prisma/zod";
import { subredditNameSchema } from "../reddit/schemas";
import { isValidLiqeString } from "../../lib/utils";

export const baseProjectSchema = projectModel.extend({
	id: z.string().uuid(),
	name: projectModel.shape.name.min(3).max(32),
	website_url: z.string().url().max(128),
	description: z.string().min(6).max(1024),
	query: z
		.string()
		.max(512)
		.refine((query) => isValidLiqeString(query), { message: "Invalid query" }),

	reply_mention_mode: z.enum(["name", "name_or_url", "url"]),
	reply_delay: z
		.number()
		.int()
		.nonnegative()
		.max(1440, { message: "Delay can not be longer than a day" }),
	reply_daily_limit: z.number().int().nonnegative().safe(),
	reply_custom_instructions: z.string().max(1024),
	webhook_url: z.string().url().max(128).nullable(),

	reddit_included_subreddits: z
		.array(subredditNameSchema)
		.max(10, {
			message: "You cannot include more than 10 subreddits",
		})
		.refine((items) => new Set(items).size === items.length, {
			message: "A subreddit cannot be included more than once",
		}),
	reddit_excluded_subreddits: z
		.array(subredditNameSchema)
		.max(10, { message: "You cannot exclude more than 10 subreddits" })
		.refine((items) => new Set(items).size === items.length, {
			message: "A subreddit cannot be excluded more than once",
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

			reply_mention_mode: true,
			reply_delay: true,
			reply_daily_limit: true,
			reply_custom_instructions: true,
			webhook_url: true,

			reddit_monitor_enabled: true,
			reddit_allow_nsfw: true,
			reddit_replies_enabled: true,
			reddit_included_subreddits: true,
			reddit_excluded_subreddits: true,
		})
		.partial(),
});

export const buyTokensInputSchema = z.object({
	project_id: baseProjectSchema.shape.id,
	amount: z
		.number()
		.int()
		.positive()
		.max(10000, { message: "You can't purchase more than 10000 tokens at a time" }),
});

export type CreateProjectInputType = z.infer<typeof createProjectInputSchema>;
export type UpdateProjectInputType = z.infer<typeof updateProjectInputSchema>;
export type BuyTokensInputType = z.infer<typeof buyTokensInputSchema>;
