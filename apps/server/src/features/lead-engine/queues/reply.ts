import Queue from "bull";
import * as botsService from "@features/bots/service";
import * as leadsService from "@features/leads/service";
import { logger } from "@lib/logger";
import { prisma } from "@lib/db";
import { env } from "@env";
import { ReplyStatus } from "@sweetreply/shared/features/leads/constants";
import { ReplyResultData } from "@features/bots/types";
import { BotError, createBot } from "@sweetreply/bots";

export type ReplyQueueJobData = {
	lead_id: string;
};

const replyQueue = new Queue<ReplyQueueJobData>("reply", {
	redis: env.REDIS_URL,
	// ? this may not be the best rate limit
	limiter: {
		max: 1,
		duration: 1000,
	},
	defaultJobOptions: {
		attempts: 3,
		removeOnComplete: true,
		removeOnFail: true,
		backoff: {
			type: "exponential",
			delay: 4000,
		},
	},
});

replyQueue.process(async (job) => {
	const jobData = job.data;

	const lead = await prisma.lead.findUnique({
		where: {
			id: jobData.lead_id,
		},
	});

	if (!lead) {
		return;
	}

	if (lead.reply_status === ReplyStatus.REPLIED) {
		return;
	}

	if (!lead.reply_text || lead.reply_text.trim().length === 0) {
		job.opts.attempts = job.attemptsMade + 1;

		throw new Error(`Lead ${jobData.lead_id} has insufficient reply text`);
	}

	const project = await prisma.project.findUnique({
		where: {
			id: lead.project_id,
		},
	});

	if (!project) {
		return;
	}

	const user = await prisma.user.findUnique({
		where: {
			id: project.user_id,
		},
	});

	if (!user) {
		return;
	}

	// the bot service cycles through each bot
	const botAccount = await botsService.dequeueBot(lead.platform);

	if (!botAccount) {
		throw new Error(`Lead ${jobData.lead_id} could not find an account to reply with`);
	}

	const bot = createBot(botAccount);

	if (bot === null || user.reply_credits <= 0) {
		await leadsService.draft(lead.id);

		return;
	}

	// --- Automation ----

	// load the session/login
	try {
		await botsService.loadSession(bot, botAccount);
	} catch (err) {
		if (err instanceof Error) {
			botsService.handleBotError(botAccount.id, err);
		}

		throw err;
	}

	let replyResult: ReplyResultData;

	// make the actual reply
	try {
		replyResult = await bot.reply(lead);
	} catch (err) {
		await botsService.saveSession(botAccount.id, bot);

		if (!(err instanceof Error)) {
			return;
		}

		if (err instanceof BotError && err.code === "REPLY_LOCKED") {
			await leadsService.lock(lead.id);

			return;
		}

		await botsService.handleBotError(botAccount.id, err);

		throw err;
	}

	await botsService.saveSession(botAccount.id, bot);

	// --- End Automation ----

	// update the lead with the reply details
	await prisma.lead.update({
		where: {
			id: lead.id,
		},
		data: {
			reply_status: ReplyStatus.REPLIED,
			replied_at: new Date(),
			reply_bot_id: botAccount.id,
			reply_remote_id: replyResult.reply_remote_id,
			reply_remote_url: replyResult.reply_remote_url,
			reply_scheduled_at: null,
		},
	});

	// deduct the reply credit from the user
	try {
		await prisma.user.update({
			where: {
				id: project.user_id,
			},
			data: {
				reply_credits: {
					decrement: 1,
				},
			},
		});
	} catch {
		// noop, we won't redo a reply just because the deduction fails for some reason
	}
});

replyQueue.on("active", async (job) => {
	const jobData = job.data;

	logger.info(
		{
			lead_id: jobData.lead_id,
		},
		"Reply job began"
	);

	await prisma.lead.update({
		where: {
			id: jobData.lead_id,
		},
		data: {
			reply_status: ReplyStatus.PENDING,
		},
	});
});

replyQueue.on("completed", async (job) => {
	const jobData = job.data;

	job.returnvalue;

	logger.info(
		{
			lead_id: jobData.lead_id,
		},
		"Reply job completed"
	);
});

replyQueue.on("failed", async (job, err) => {
	const jobData = job.data;

	logger.error(
		{
			lead_id: jobData.lead_id,
			message: err.message,
			attempt: job.attemptsMade,
		},
		`Reply job failed`
	);

	if (job.attemptsMade === job.opts.attempts) {
		try {
			await prisma.lead.update({
				where: {
					id: jobData.lead_id,
				},
				data: {
					reply_status: ReplyStatus.FAILED,
					replied_at: null,
					reply_scheduled_at: null,
				},
			});
		} catch {}
	}
});

export { replyQueue };
