import { RedditBot } from "@sweetreply/bots";
import type { Bot, Lead } from "@sweetreply/prisma";

export interface ILeadBot {
	login(): Promise<any>;
	reply(): Promise<any>;
	deleteReply(): Promise<any>;
}

export class RedditLeadBot implements ILeadBot {
	private redditBot: RedditBot;
	private lead: Lead;

	constructor({ bot, lead }: { bot: Bot; lead: Lead }) {
		this.lead = lead;

		this.redditBot = new RedditBot({
			username: bot.username,
			password: bot.password,
		});
	}

	public login() {
		return this.redditBot.login();
	}

	public reply() {
		return this.redditBot.comment({
			postId: this.lead.remote_id,
			targetType: this.lead.type as "post" | "comment",
			subredditName: this.lead.channel as string,
			content: this.lead.content,
		});
	}

	public deleteReply() {
		if (!this.lead.remote_reply_id) {
			throw new Error("Lead does not have a remote reply id");
		}

		return this.redditBot.deleteComment({
			commentId: this.lead.remote_reply_id as string,
			subredditName: this.lead.channel as string,
		});
	}
}
