import { LeadPlatform } from "@sweetreply/shared/features/leads/constants";
import { RedditBrowserBot } from "./reddit/browser";
import type { Bot } from "@sweetreply/prisma";

export const proxyIsDefined = (
	bot: Pick<Bot, "proxy_host" | "proxy_port" | "proxy_user" | "proxy_pass">
): Boolean => !!bot.proxy_host && !!bot.proxy_port && !!bot.proxy_user && !!bot.proxy_pass;

export const createBot = (bot: Bot) =>
	bot.platform === LeadPlatform.REDDIT ? new RedditBrowserBot(bot) : null;
