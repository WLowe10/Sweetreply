import { replyStatus } from "./constants";
import type { Lead } from "@sweetreply/prisma";

export const canSendReply = (lead: Pick<Lead, "reply_status" | "reply_text">) =>
	lead.reply_status !== replyStatus.REPLIED &&
	lead.reply_status !== replyStatus.PENDING &&
	lead.reply_status !== replyStatus.SCHEDULED &&
	lead.reply_text &&
	lead.reply_text.length > 0;

export const canUndoReply = (lead: Pick<Lead, "reply_status">) =>
	lead.reply_status === replyStatus.REPLIED;

export const canEditReply = (lead: Pick<Lead, "reply_status">) =>
	lead.reply_status === replyStatus.DRAFT || lead.reply_status === replyStatus.SCHEDULED;

export const canCancelReply = (lead: Pick<Lead, "reply_status">) =>
	lead.reply_status === replyStatus.SCHEDULED;
