import { LeadPlatform } from "@sweetreply/shared/features/leads/constants";
import { RedditBrowserBot } from "./reddit/browser";
import { sleep } from "@sweetreply/shared/lib/utils";
import type { ElementHandle } from "puppeteer";
import type { Bot } from "@sweetreply/prisma";

export const botHasProxy = (
	bot: Pick<Bot, "proxy_host" | "proxy_port" | "proxy_user" | "proxy_pass">
): Boolean => !!bot.proxy_host && !!bot.proxy_port && !!bot.proxy_user && !!bot.proxy_pass;

export const createBot = (bot: Bot) =>
	bot.platform === LeadPlatform.REDDIT ? new RedditBrowserBot(bot) : null;

export type RealisticTypeOpts = {
	wpm: number;
};

// export async function realisticType(
// 	element: ElementHandle,
// 	text: string,
// 	opts?: RealisticTypeOpts
// ) {
// 	const wpm = opts?.wpm || 75;

// 	const avgWordLength = 6;
// 	const charsPerMinute = wpm * avgWordLength;
// 	const msPerChar = 60000 / charsPerMinute; // milliseconds per character

// 	const minDelay = msPerChar * 0.8;
// 	const maxDelay = msPerChar * 1.2;

// 	for (const char of text) {
// 		const delay = Math.random() * (maxDelay - minDelay) + minDelay;
// 		await element.type(char, { delay });
// 	}
// }
