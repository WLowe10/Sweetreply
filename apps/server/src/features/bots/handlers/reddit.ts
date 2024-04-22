import { RedditBot } from "@sweetreply/bots";
import { proxyIsDefined } from "../utils/proxy-is-defined";
import { extractIdFromThing } from "@sweetreply/shared/features/reddit/utils";
import type { IBotHandler, BotHandlerConstructor } from "../types";
import type { Lead } from "@sweetreply/prisma";
import type { RedditThing } from "@sweetreply/shared/features/reddit/constants";

export class RedditBotHandler implements IBotHandler {
	private redditBot: RedditBot;
	private lead: Lead;

	constructor({ bot, lead }: BotHandlerConstructor) {
		this.lead = lead;

		this.redditBot = new RedditBot({
			username: bot.username,
			password: bot.password,
			proxy: proxyIsDefined(bot) && {
				host: bot.proxy_host!,
				port: bot.proxy_port!,
				auth: {
					username: bot.proxy_user!,
					password: bot.proxy_pass!,
				},
			},
		});
	}

	public login() {
		return this.redditBot.login();
	}

	public async reply() {
		const targetType: RedditThing = this.lead.type === "post" ? "link" : "comment";

		const result = await this.redditBot.comment({
			postId: this.lead.remote_id,
			targetType: targetType,
			subredditName: this.lead.channel as string,
			content: this.lead.reply_text!,
		});

		return {
			reply_remote_id: extractIdFromThing(result.id),
		};
	}

	public deleteReply() {
		return this.redditBot.deleteComment({
			commentId: this.lead.reply_remote_id as string,
			subredditName: this.lead.channel as string,
		});
	}
}
