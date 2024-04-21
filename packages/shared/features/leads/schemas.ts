import { leadModel } from "@sweetreply/prisma/zod";
import { z } from "zod";

export const baseLeadSchema = leadModel.extend({
	reply_text: z.string().min(6).max(1024), // todo reevaluate max length
});

export const editReplyInputSchema = z.object({
	lead_id: z.string(),
	data: baseLeadSchema.pick({
		reply_text: true,
	}),
});

export type EditReplyInputType = z.infer<typeof editReplyInputSchema>;
