import { leadModel } from "@sweetreply/prisma/zod";
import { addDays, isBefore, isFuture } from "date-fns";
import { z } from "zod";

export const baseLeadSchema = leadModel.extend({
	reply_text: z.string().min(3).max(4096),
});

export const sendReplyInputDataSchema = z.object({
	date: z
		.date()
		.refine((date) => isFuture(date), { message: "Date must be in the future" })
		.refine((date) => isBefore(date, addDays(new Date(), 30)), {
			message: "Date can not be more than 30 days in the future",
		})
		.nullish(),
});

export const sendReplyInputSchema = z.object({
	lead_id: z.string(),
	data: sendReplyInputDataSchema.optional(),
});

export const editReplyInputSchema = z.object({
	lead_id: z.string(),
	data: baseLeadSchema.pick({
		reply_text: true,
	}),
});

export type SendReplyInputType = z.infer<typeof sendReplyInputSchema>;
export type SendReplyInputDataType = z.infer<typeof sendReplyInputDataSchema>;
export type EditReplyInputType = z.infer<typeof editReplyInputSchema>;
