import { z } from "zod";

export const generatePlaygroundReplyInputSchema = z.object({
	product_name: z.string().max(64),
	product_description: z.string().max(1024),
	social_media_post: z.string().max(1024),
});

export type GeneratePlaygroundReplyInputType = z.infer<typeof generatePlaygroundReplyInputSchema>;
