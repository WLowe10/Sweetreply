import { addDays, endOfDay } from "date-fns";
import { ReplyStatus, ReplyStatusColor } from "./constants";
import type { Lead } from "@sweetreply/prisma";

export const getMaxFutureReplyDate = () => endOfDay(addDays(new Date(), 30));

export const canDeleteLead = (lead: Pick<Lead, "reply_status">) =>
	lead.reply_status === ReplyStatus.REPLIED ||
	lead.reply_status === ReplyStatus.NONE ||
	lead.reply_status === ReplyStatus.FAILED ||
	lead.reply_status === ReplyStatus.DRAFT;

export const canSendReply = (lead: Pick<Lead, "reply_status" | "reply_text" | "locked">) =>
	(lead.reply_status === ReplyStatus.FAILED ||
		lead.reply_status === ReplyStatus.NONE ||
		lead.reply_status === ReplyStatus.DRAFT) &&
	!lead.locked &&
	lead.reply_text &&
	lead.reply_text.trim().length > 0;

export const canUndoReply = (lead: Pick<Lead, "reply_status" | "locked">) =>
	lead.reply_status === ReplyStatus.REPLIED && !lead.locked;

export const canEditReply = (lead: Pick<Lead, "reply_status">) =>
	lead.reply_status === ReplyStatus.DRAFT ||
	lead.reply_status === ReplyStatus.SCHEDULED ||
	lead.reply_status === ReplyStatus.FAILED ||
	lead.reply_status === ReplyStatus.NONE;

export const canGenerateReply = (lead: Pick<Lead, "reply_status" | "replies_generated">) =>
	canEditReply(lead) && lead.replies_generated < 2;

export const canCancelReply = (lead: Pick<Lead, "reply_status">) =>
	lead.reply_status === ReplyStatus.SCHEDULED;

export const getReplyStatusColor = (status: string | null): string | undefined =>
	//@ts-ignore
	status === null ? ReplyStatusColor.NONE : ReplyStatusColor[status];
