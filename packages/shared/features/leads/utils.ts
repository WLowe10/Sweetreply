import { addDays, endOfDay } from "date-fns";
import { replyStatus, replyStatusColors } from "./constants";
import type { Lead } from "@sweetreply/prisma";

export const getMaxFutureReplyDate = () => endOfDay(addDays(new Date(), 30));

export const canDeleteLead = (lead: Pick<Lead, "reply_status">) =>
	lead.reply_status === replyStatus.REPLIED ||
	lead.reply_status === replyStatus.NONE ||
	lead.reply_status === replyStatus.FAILED ||
	lead.reply_status === replyStatus.DRAFT;

export const canSendReply = (lead: Pick<Lead, "reply_status" | "reply_text">) =>
	(lead.reply_status === replyStatus.FAILED ||
		lead.reply_status === replyStatus.NONE ||
		lead.reply_status === replyStatus.DRAFT) &&
	lead.reply_text &&
	lead.reply_text.length > 0;

export const canUndoReply = (lead: Pick<Lead, "reply_status">) =>
	lead.reply_status === replyStatus.REPLIED;

export const canEditReply = (lead: Pick<Lead, "reply_status">) =>
	lead.reply_status === replyStatus.DRAFT ||
	lead.reply_status === replyStatus.SCHEDULED ||
	lead.reply_status === replyStatus.FAILED ||
	lead.reply_status === replyStatus.NONE;

export const canGenerateReply = (lead: Pick<Lead, "reply_status" | "replies_generated">) =>
	canEditReply(lead) && lead.replies_generated < 2;

export const canCancelReply = (lead: Pick<Lead, "reply_status">) =>
	lead.reply_status === replyStatus.SCHEDULED;

export const getReplyStatusColor = (status: string | null): string | undefined =>
	//@ts-ignore
	status === null ? replyStatusColors.NONE : replyStatusColors[status];
