export const leadPlatform = {
	REDDIT: "reddit",
} as const;

export const replyStatus: Record<string, string | null> = {
	PENDING: "pending",
	SCHEDULED: "scheduled",
	DRAFT: "draft",
	REPLIED: "replied",
	DELETED: "deleted",
	NONE: null,
} as const;
