import type { Lead } from "@sweetreply/prisma";

export type ProxyType = {
	host: string;
	port: number;
	username: string;
	password: string;
};

export type ReplyResultData = {
	reply_remote_id: string;
	reply_remote_url: string | null;
};

export type ReplyInputData = Pick<Lead, "type" | "remote_id" | "group"> & { reply_text: string };

export type DeleteReplyInputData = Pick<Lead, "reply_remote_id" | "remote_id" | "group" | "type">;

export interface IBot {
	loadSession(session: object): Promise<boolean>;
	dumpSession(): Promise<object>;
	generateSession(): Promise<object>;
	reply(lead: ReplyInputData): Promise<ReplyResultData>;
	deleteReply(lead: DeleteReplyInputData): Promise<void>;
	setup?(): Promise<void>;
	teardown?(): Promise<void>;
}
