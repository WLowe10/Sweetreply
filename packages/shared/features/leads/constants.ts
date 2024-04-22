export const leadPlatform = {
	REDDIT: "reddit",
} as const;

export const replyStatus = {
	PENDING: "pending",
	SCHEDULED: "scheduled",
	DRAFT: "draft",
	REPLIED: "replied",
	NULL: null,
} as const;

export const replyStatusColors = {
	[replyStatus.PENDING]: "teal",
	[replyStatus.SCHEDULED]: "blue",
	[replyStatus.DRAFT]: "gray",
	[replyStatus.REPLIED]: "green",
	NULL: "gray",
} as const;
