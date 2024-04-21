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

	public async appendError(botId: string, message: string) {
		const newError = await prisma.botError.create({
			data: {
				bot_id: botId,
				message: message,
			},
		});

		const errorCountLast24Hours = await prisma.botError.count({
			where: {
				bot_id: botId,
				date: {
					gt: new Date(new Date().getTime() - 24 * 60 * 60 * 1000), // 24 hours ago
					lte: new Date(),
				},
			},
		});

		// if there are more than 3 errors in the last 24 hours, the bot will become inactive, requiring manual verification
		if (errorCountLast24Hours > 3) {
			await prisma.bot.update({
				where: {
					id: botId,
				},
				data: {
					active: false,
					status: "error",
				},
			});
		}

		return newError;
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
