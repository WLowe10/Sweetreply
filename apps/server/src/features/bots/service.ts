import { prisma } from "@/lib/db";
import { RedditBot } from "@sweetreply/bots";

export class BotsService {
	public getBot(id: string) {
		return prisma.bot.findUniqueOrThrow({
			where: {
				id,
			},
		});
	}

	public async getTop(platform: string) {
		const topBot = await prisma.bot.findFirst({
			where: {
				platform,
				active: true,
			},
			orderBy: {
				last_used_at: "asc",
			},
		});

		if (!topBot) {
			return null;
		}

		const updatedBot = prisma.bot.update({
			where: {
				id: topBot.id,
			},
			data: {
				last_used_at: new Date(),
			},
		});

		return updatedBot;
	}

	public async checkBanned(botId: string) {
		const bot = await this.getBot(botId);

		let isBanned = false;

		if (bot.platform === "reddit") {
			isBanned = await RedditBot.isBanned(bot.username);
		} else {
			throw new Error(`Can't check for banned account on this platform`);
		}

		return isBanned;
	}
}

export const botsService = new BotsService();
