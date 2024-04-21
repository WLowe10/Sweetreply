import { leadModel } from "@sweetreply/prisma/zod";
import { z } from "zod";

export const baseLeadSchema = leadModel.extend({
	reply_text: z.string().min(3).max(4096),
});

export const editReplyInputSchema = z.object({
	lead_id: z.string(),
	data: baseLeadSchema.pick({
		reply_text: true,
	}),
});

export type EditReplyInputType = z.infer<typeof editReplyInputSchema>;
