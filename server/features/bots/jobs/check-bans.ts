import { CronJob } from "cron";
import { prisma } from "~/lib/prisma";
import { LeadPlatform } from "~/features/leads/constants";
import { checkRedditBan } from "../utils";
import * as botsService from "../service";

// This job checks if the bots are banned from their applicable corresponding platforms every 30 minutes

export const checkBansJob = CronJob.from({
	cronTime: "*/30 * * * *",
	onTick: async function () {
		const bots = await prisma.bot.findMany({
			where: {
				active: true,
				platform: LeadPlatform.REDDIT,
			},
		});

		for (const bot of bots) {
			let isBanned = false;

			if (bot.platform === LeadPlatform.REDDIT) {
				isBanned = await checkRedditBan(bot.username);
			}

			if (isBanned) {
				await botsService.deactivateBot(bot.id, "BANNED");
			}
		}
	},
});
