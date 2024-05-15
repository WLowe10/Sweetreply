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
	setup?(): Promise<void>;
	teardown?(): Promise<void>;
	parseSessionDump(dump: object): object;
	loadSession(session: object): Promise<boolean>;
	dumpSession(): Promise<object>;
	generateSession(): Promise<object>;

	reply(lead: Lead): Promise<ReplyResultData>;
	deleteReply(lead: Lead): Promise<void>;
}
