import type { Bot, Lead } from "@sweetreply/prisma";

export type BotHandlerConstructor = {
	bot: Bot;
	lead: Lead;
};

export type ReplyResultData = {
	remote_reply_id: string;
};

export interface IBotHandler {
	login(): void;
	reply(): Promise<ReplyResultData>;
	deleteReply(): void;
}
