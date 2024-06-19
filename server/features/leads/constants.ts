import type { Prisma } from "@prisma/client";

export const LeadPlatform = {
	REDDIT: "reddit",
} as const;

export type LeadPlatformType = (typeof LeadPlatform)[keyof typeof LeadPlatform];

export const LeadType = {
	POST: "post",
	COMMENT: "comment",
} as const;

// bruh
export type LeadTypeType = (typeof LeadType)[keyof typeof LeadType];

export const ReplyStatus = {
	PENDING: "pending",
	SCHEDULED: "scheduled",
	DRAFT: "draft",
	REPLIED: "replied",
	FAILED: "failed",
	REMOVING: "removing",
	NONE: "none",
} as const;

export type ReplyStatusType = (typeof ReplyStatus)[keyof typeof ReplyStatus];

export const ReplyCharacterLimit = {
	[LeadPlatform.REDDIT]: 4096,
} as const;

export const BotAction = {
	REPLY: "reply",
	REMOVE_REPLY: "remove_reply",
} as const;

export type BotActionType = (typeof BotAction)[keyof typeof BotAction];

export const singleLeadQuerySelect: Prisma.LeadSelect = {
	id: true,
	platform: true,
	type: true,
	locked: true,
	username: true,
	name: true,
	title: true,
	content: true,
	date: true,
	project_id: true,
	remote_user_id: true,
	remote_id: true,
	remote_parent_id: true,
	remote_group_id: true,
	remote_url: true,
	group: true,
	reply_status: true,
	replied_at: true,
	reply_text: true,
	reply_remote_id: true,
	reply_scheduled_at: true,
	replies_generated: true,
	reply_remote_url: true,
	created_at: true,
} as const;
