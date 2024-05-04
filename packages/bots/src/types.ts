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

export interface IBot {
	loadSession(session: object): Promise<boolean>;
	dumpSession(): object | Promise<string>;
	generateSession(): Promise<object>;
	reply(lead: Lead): Promise<ReplyResultData>;
	deleteReply(lead: Lead): Promise<void>;
}
