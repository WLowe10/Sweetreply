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
	NONE: null,
} as const;

export type ReplyStatusType = (typeof ReplyStatus)[keyof typeof ReplyStatus];

export const ReplyStatusColor = {
	[ReplyStatus.PENDING]: "teal",
	[ReplyStatus.SCHEDULED]: "blue",
	[ReplyStatus.DRAFT]: "gray",
	[ReplyStatus.REPLIED]: "green",
	[ReplyStatus.FAILED]: "red",
	NONE: "gray",
} as const;

export const ReplyCharacterLimit = {
	[LeadPlatform.REDDIT]: 4096,
} as const;
