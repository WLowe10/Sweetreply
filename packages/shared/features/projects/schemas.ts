import { z } from "zod";
import { projectModel } from "@sweetreply/prisma/zod";

export const baseProjectSchema = projectModel.extend({
	id: z.string().uuid(),
	name: projectModel.shape.name.min(3).max(32),
});

export const createProjectInputSchema = baseProjectSchema.pick({
	name: true,
});

export const updateProjectInputSchema = z.object({
	id: baseProjectSchema.shape.id,
	data: baseProjectSchema.pick({
		name: true,
	}),
});
