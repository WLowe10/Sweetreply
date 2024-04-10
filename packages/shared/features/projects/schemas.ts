import { z } from "zod";
import { projectModel } from "@sweetreply/prisma/zod";

export const baseProjectSchema = projectModel.extend({
	id: z.string().uuid(),
	name: projectModel.shape.name.min(3).max(32),
	description: z.string().min(6).max(1024),
	keywords: z
		.array(z.string().min(1, { message: "Keywords must be at least 1 character long" }))
		.max(10, {
			message: "Cannot have more than 10 keywords",
		}),
});

export const createProjectInputSchema = baseProjectSchema.pick({
	name: true,
});

export const updateProjectInputSchema = z.object({
	id: baseProjectSchema.shape.id,
	data: baseProjectSchema.pick({
		name: true,
		description: true,
		keywords: true,
	}),
});

export type CreateProjectInputType = z.infer<typeof createProjectInputSchema>;
export type UpdateProjectInputType = z.infer<typeof updateProjectInputSchema>;
