import { ReplyStatus } from "~/features/leads/constants";

export const ReplyStatusColor = {
	[ReplyStatus.PENDING]: "teal",
	[ReplyStatus.SCHEDULED]: "blue",
	[ReplyStatus.DRAFT]: "gray",
	[ReplyStatus.REPLIED]: "green",
	[ReplyStatus.FAILED]: "red",
	[ReplyStatus.REMOVING]: "orange",
	[ReplyStatus.NONE]: "gray",
} as const;

export const getReplyStatusColor = (status: string | null): string | undefined =>
	// @ts-ignore
	status === null ? ReplyStatusColor[ReplyStatus.NONE] : ReplyStatusColor[status];
