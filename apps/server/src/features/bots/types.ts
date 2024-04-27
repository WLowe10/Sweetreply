import type { Bot, Lead } from "@sweetreply/prisma";

export type BotHandlerConstructor = {
	bot: Bot;
	lead: Lead;
};

export type ReplyResultData = {
	reply_remote_id: string;
	reply_remote_url: string | null;
};

export interface IBotHandler {
	login(): void;
	reply(): Promise<ReplyResultData>;
	deleteReply(): void;
}
