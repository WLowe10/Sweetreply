import { z } from "zod";
import { projectModel } from "@sweetreply/prisma/zod";

export const baseProjectSchema = projectModel.extend({
	id: z.string().uuid(),
	name: projectModel.shape.name.min(3).max(32),
	website_url: z.string().url().max(128),
	description: z.string().min(6).max(1024),
	query: z.string().max(512),
	custom_reply_instructions: z.string().max(512),
	webhook_url: z.string().url().max(128),
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
			custom_reply_instructions: true,
			webhook_url: true,
		})
		.partial(),
});

export type CreateProjectInputType = z.infer<typeof createProjectInputSchema>;
export type UpdateProjectInputType = z.infer<typeof updateProjectInputSchema>;
