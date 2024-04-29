import { leadModel } from "@sweetreply/prisma/zod";
import { isBefore, isFuture } from "date-fns";
import { getMaxFutureReplyDate } from "./utils";
import { z } from "zod";
import { LeadPlatform, ReplyCharacterLimit } from "./constants";

export const leadPlatformSchema = z.enum([LeadPlatform.REDDIT]);

export const baseLeadSchema = leadModel.extend({
	platform: leadPlatformSchema,
	reply_text: z.string().min(3),
});

export const sendReplyInputDataSchema = z.object({
	date: z
		.date()
		.refine((date) => isFuture(date), { message: "Date must be in the future" })
		.refine((date) => isBefore(date, getMaxFutureReplyDate()), {
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
