import axios from "axios";
import { getAxiosScrapingProxy } from "~/utils";
import { LeadPlatform } from "~/features/leads/constants";
import { RedditBrowserBot } from "./reddit/browser";
import type { Bot } from "@prisma/client";

export const botHasProxy = (
	bot: Pick<Bot, "proxy_host" | "proxy_port" | "proxy_user" | "proxy_pass">
): Boolean => !!bot.proxy_host && !!bot.proxy_port && !!bot.proxy_user && !!bot.proxy_pass;

export const createBot = (bot: Bot) =>
	bot.platform === LeadPlatform.REDDIT ? new RedditBrowserBot(bot) : null;

export type RealisticTypeOpts = {
	wpm: number;
};

export async function checkRedditBan(username: string): Promise<boolean> {
	const response = await axios.get(`https://www.reddit.com/user/${username}`, {
		proxy: getAxiosScrapingProxy(),
	});

	return response.data.includes('<span slot="title">This account has been suspended</span>');
}
