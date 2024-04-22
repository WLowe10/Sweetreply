import type { Bot, Lead } from "@sweetreply/prisma";

export type BotHandlerConstructor = {
	bot: Bot;
	lead: Lead;
};

export type ReplyResultData = {
	reply_remote_id: string;
};

export interface IBotHandler {
	login(): void;
	reply(): Promise<ReplyResultData>;
	deleteReply(): void;
}
