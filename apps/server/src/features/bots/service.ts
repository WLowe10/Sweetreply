import { prisma } from "@lib/db";
import { subDays } from "date-fns";
import { BotError } from "@sweetreply/bots";

export async function getBot(id: string) {
	return prisma.bot.findUniqueOrThrow({
		where: {
			id,
		},
	});
}

export async function dequeueBot(platform: string) {
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

export async function appendError(botId: string, err: BotError, limit?: number) {
	const newError = await prisma.botError.create({
		data: {
			bot_id: botId,
			code: err.code,
			message: err.message,
		},
	});

	const errorCountLast24Hours = await prisma.botError.count({
		where: {
			bot_id: botId,
			code: err.code,
			date: {
				gte: subDays(new Date(), 1),
			},
		},
	});

	// if there are more than 3 errors in the last 24 hours, the bot will become inactive, requiring manual verification
	if (limit && errorCountLast24Hours >= limit) {
		await prisma.bot.update({
			where: {
				id: botId,
			},
			data: {
				active: false,
				status: err.code,
			},
		});
	}

	return newError;
}

export async function handleBotError(botID: string, err: BotError) {
	const errIsFatal = err.code === "BANNED" || err.code === "INVALID_CREDENTIALS";

	if (errIsFatal) {
		await appendError(botID, err, 1);
	} else {
		await appendError(botID, err, 3);
	}
}
