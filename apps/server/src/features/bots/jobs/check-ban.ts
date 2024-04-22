import { CronJob } from "cron";
import { RedditBot } from "@sweetreply/bots";
import { logger } from "@/lib/logger";
import { prisma } from "@/lib/db";
import { botStatus } from "../constants";

// not currently enabled, POC
export const checkBanJob = CronJob.from({
	cronTime: "0 * * * *",
	onTick: async () => {
		logger.info("Checking bans");

		const redditAccounts = await prisma.bot.findMany({
			where: {
				platform: "reddit",
			},
		});

		for (const bot of redditAccounts) {
			const isBanned = await RedditBot.isBanned(bot.username);

			if (isBanned) {
				await prisma.bot.update({
					where: {
						id: bot.id,
					},
					data: {
						active: false,
						status: botStatus.BANNED,
					},
				});
			}
		}
	},
});
