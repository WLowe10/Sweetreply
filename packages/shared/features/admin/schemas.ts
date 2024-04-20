import { botModel } from "@sweetreply/prisma/zod";
import { z } from "zod";

export const baseBotSchema = botModel.extend({
	platform: z.enum(["reddit"]),
});

export const updateBotInputSchema = z.object({
	id: baseBotSchema.shape.id,
	data: baseBotSchema
		.pick({
			platform: true,
			username: true,
			active: true,
			status: true,
			password: true,
			proxy_host: true,
			proxy_port: true,
			proxy_user: true,
			proxy_pass: true,
		})
		.partial(),
});

export const createBotInputSchema = baseBotSchema.pick({
	platform: true,
	username: true,
	active: true,
	status: true,
	password: true,
	proxy_host: true,
	proxy_port: true,
	proxy_user: true,
	proxy_pass: true,
});

export type CreateBotInputType = z.infer<typeof createBotInputSchema>;
export type UpdateBotInputType = z.infer<typeof updateBotInputSchema>;
