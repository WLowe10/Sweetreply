import { RedditBot } from "@sweetreply/bots";
import { proxyIsDefined } from "../utils/proxy-is-defined";
import { extractIdFromThing } from "@sweetreply/shared/features/reddit/utils";
import type { IBotHandler, BotHandlerConstructor, ReplyResultData } from "../types";
import type { Lead } from "@sweetreply/prisma";
import type { RedditThingType } from "@sweetreply/shared/features/reddit/constants";

export class RedditBotHandler implements IBotHandler {
	private redditBot: RedditBot;
	private lead: Lead;

	constructor({ bot, lead }: BotHandlerConstructor) {
		this.lead = lead;

		this.redditBot = new RedditBot({
			username: bot.username,
			password: bot.password,
			proxy: proxyIsDefined(bot) && {
				protocol: "http",
				host: bot.proxy_host!,
				port: bot.proxy_port!,
				auth: {
					username: bot.proxy_user!,
					password: bot.proxy_pass!,
				},
			},
		});
	}

	public async login() {
		await this.redditBot.login();
	}

	public async reply() {
		const targetType: RedditThingType = this.lead.type === "post" ? "link" : "comment";

		const result = await this.redditBot.comment({
			postId: this.lead.remote_id,
			targetType: targetType,
			subredditName: this.lead.channel as string,
			content: this.lead.reply_text!,
		});

		const remoteId = extractIdFromThing(result.id);

		return {
			reply_remote_id: remoteId,
			reply_remote_url: `https://www.reddit.com/r/${this.lead.channel}/comments/${extractIdFromThing(result.link)}/comment/${remoteId}`,
		};
	}

	public deleteReply() {
		return this.redditBot.deleteComment({
			commentId: this.lead.reply_remote_id as string,
			subredditName: this.lead.channel as string,
		});
	}
}
