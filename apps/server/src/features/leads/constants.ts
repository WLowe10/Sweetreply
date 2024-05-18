import { Prisma } from "@sweetreply/prisma";

export const BotActions = {
	REPLY: "reply",
	REMOVE_REPLY: "remove_reply",
};

export type BotActionType = (typeof BotActions)[keyof typeof BotActions];

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
