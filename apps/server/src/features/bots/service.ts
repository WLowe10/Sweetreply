import { prisma } from "@lib/db";
import { subDays } from "date-fns";
import { BotError, type IBot } from "@sweetreply/bots";
import { Prisma, Bot } from "@sweetreply/prisma";
import { sleepRange } from "@sweetreply/shared/lib/utils";
import { HTTPError, RequestError } from "got";
import { logger } from "@lib/logger";

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
			last_used_at: {
				sort: "asc",
				nulls: "first",
			},
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

export async function handleBotError(botID: string, err: Error) {
	if (err instanceof BotError) {
		const errIsFatal = err.code === "BANNED" || err.code === "INVALID_CREDENTIALS";

		if (errIsFatal) {
			await appendError(botID, err, 1);
		} else {
			await appendError(botID, err, 3);
		}
	} else if (err instanceof RequestError) {
		await appendError(botID, new BotError("REQUEST_FAILED", err.message), 10);
	}
}

export async function updateBotSession(botID: string, session: object | null) {
	return prisma.bot.update({
		where: {
			id: botID,
		},
		data: {
			session: session || Prisma.JsonNull,
		},
	});
}

export async function loadSession(bot: IBot, botAccount: Bot) {
	let sessionIsValid = false;
	let session = botAccount.session;

	if (botAccount.session) {
		sessionIsValid = await bot.loadSession(botAccount.session as object);
	}

	if (!sessionIsValid) {
		// clear the session so it isn't used again
		if (botAccount.session !== null) {
			await updateBotSession(botAccount.id, null);
		}

		logger.debug("Generating new bot session", {
			id: botAccount.id,
		});

		session = await bot.generateSession();

		await updateBotSession(botAccount.id, session);

		// sleep for a random delay between 5000 and 10000 ms after logging in
		await sleepRange(5000, 10000);
	}

	return session;
}

export async function saveSession(botID: string, bot: IBot) {
	const finalSession = await bot.dumpSession();

	await updateBotSession(botID, finalSession);
}
