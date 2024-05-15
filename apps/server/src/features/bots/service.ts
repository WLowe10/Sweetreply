import { prisma } from "@lib/db";
import { subDays } from "date-fns";
import { BotError, createBot, type IBot } from "@sweetreply/bots";
import { Prisma, Bot } from "@sweetreply/prisma";
import { sleepRange } from "@sweetreply/shared/lib/utils";
import { RequestError } from "got";
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
		throw new Error("Could not find an active bot");
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

export async function executeBot(botAccount: Bot, execFn: (bot: IBot) => void): Promise<void> {
	const bot = await createBot(botAccount);

	if (!bot) {
		throw new Error("Failed to create bot instance, not supported");
	}

	if (bot.setup) {
		await bot.setup();
	}

	try {
		let sessionIsValid = false;

		if (botAccount.session) {
			let parsedDump: object | undefined;

			try {
				parsedDump = await bot.parseSessionDump(botAccount.session as object);
			} catch {
				// noop
			}

			if (parsedDump) {
				sessionIsValid = await bot.loadSession(parsedDump as any);
			}
		}

		if (!sessionIsValid) {
			logger.debug("Generating new bot session", {
				bot_id: botAccount.id,
			});

			await bot.generateSession();

			await sleepRange(5000, 7500);
		}

		await execFn(bot);
	} catch (err) {
		if (err instanceof Error) {
			handleBotError(botAccount.id, err);
		}

		throw err;
	} finally {
		const finalSession = await bot.dumpSession();

		logger.debug("Updating bot session", {
			bot_id: botAccount.id,
		});

		await updateBotSession(botAccount.id, finalSession);

		if (bot.teardown) {
			await bot.teardown();
		}
	}
}
