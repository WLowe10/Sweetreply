import { z } from "zod";
import { projectModel } from "@prisma-zod";
import { subredditNameSchema } from "~/features/reddit/schemas";

const isValidURLString = (str: string) => {
	let url;

	try {
		url = new URL(str);
	} catch {
		return false;
	}

	return url.protocol === "http:" || url.protocol === "https:";
};

const keywordSchema = z.string().min(2).max(32);

export const baseProjectSchema = projectModel.extend({
	id: z.string().uuid(),
	name: projectModel.shape.name.min(3).max(32),
	website_url: z
		.string()
		.max(128)
		.refine(isValidURLString, {
			message: "Invalid URL",
		})
		.nullish()
		.or(z.literal("")),
	description: z.string().trim().min(10).max(512).nullish().or(z.literal("")),
	keywords: z.array(keywordSchema).max(50),
	negative_keywords: z.array(keywordSchema).max(50),

	reply_mention_mode: z.enum(["name", "name_or_url", "url"]),
	reply_delay: z
		.union([
			z.literal(1),
			z.literal(2),
			z.literal(4),
			z.literal(8),
			z.literal(12),
			z.literal(16),
			z.literal(20),
			z.literal(24),
			z.literal(48),
		])
		.nullable(),
	reply_daily_limit: z.number().int().nonnegative().safe(),
	reply_custom_instructions: z.string().max(1024),
	webhook_url: z.string().url().max(128).nullable(),

	reddit_included_subreddits: z
		.array(subredditNameSchema)
		.max(50, {
			message: "You cannot include more than 50 subreddits",
		})
		.refine(items => new Set(items).size === items.length, {
			message: "A subreddit cannot be included more than once",
		}),
	reddit_excluded_subreddits: z
		.array(subredditNameSchema)
		.max(50, { message: "You cannot exclude more than 50 subreddits" })
		.refine(items => new Set(items).size === items.length, {
			message: "A subreddit cannot be excluded more than once",
		}),
});

export const createProjectInputSchema = baseProjectSchema
	.pick({
		name: true,
		description: true,
		website_url: true,
	})
	.extend({
		website_url: baseProjectSchema.shape.website_url.nullish().or(z.literal("")),
		description: baseProjectSchema.shape.description.nullish().or(z.literal("")),
	});

export const updateProjectInputSchema = z.object({
	id: baseProjectSchema.shape.id,
	data: baseProjectSchema
		.pick({
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
			webhook_url: true,

			reddit_monitor_enabled: true,
			reddit_allow_nsfw: true,
			reddit_replies_enabled: true,
			reddit_included_subreddits: true,
			reddit_excluded_subreddits: true,
		})
		.partial(),
});

export type CreateProjectInputType = z.infer<typeof createProjectInputSchema>;
export type UpdateProjectInputType = z.infer<typeof updateProjectInputSchema>;
