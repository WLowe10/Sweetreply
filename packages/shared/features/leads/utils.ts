import { replyStatus } from "./constants";
import type { Lead } from "@sweetreply/prisma";

export const canReply = (lead: Pick<Lead, "reply_status">) =>
	lead.reply_status === replyStatus.DELETED;

export const canDeleteReply = (lead: Pick<Lead, "reply_status">) =>
	lead.reply_status === replyStatus.REPLIED;

export const canEditReply = (lead: Pick<Lead, "reply_status">) =>
	lead.reply_status !== replyStatus.REPLIED && lead.reply_status !== replyStatus.PENDING;
