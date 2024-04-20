import { RedditBot } from "@sweetreply/bots";
import type { IBotHandler, BotHandlerConstructor } from "../types";
import type { Lead } from "@sweetreply/prisma";

export class RedditBotHandler implements IBotHandler {
	private redditBot: RedditBot;
	private lead: Lead;

	constructor({ bot, lead }: BotHandlerConstructor) {
		this.lead = lead;

		this.redditBot = new RedditBot({
			username: bot.username,
			password: bot.password,
		});
	}

	public login() {
		return this.redditBot.login();
	}

	public async reply() {
		const result = await this.redditBot.comment({
			postId: this.lead.remote_id,
			targetType: this.lead.type as "post" | "comment",
			subredditName: this.lead.channel as string,
			content: this.lead.content,
		});

		return {
			remote_reply_id: result.id.slice(3),
		};
	}

	public deleteReply() {
		return this.redditBot.deleteComment({
			commentId: this.lead.remote_reply_id as string,
			subredditName: this.lead.channel as string,
		});
	}
}
