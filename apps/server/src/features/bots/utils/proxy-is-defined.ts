import type { Bot } from "@sweetreply/prisma";

export const proxyIsDefined = (bot: Bot): Boolean =>
	!!bot.proxy_host && !!bot.proxy_port && !!bot.proxy_user && !!bot.proxy_pass;
