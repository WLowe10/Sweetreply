import Queue from "bull";
import { logger } from "@lib/logger";
import { prisma } from "@lib/db";
import { env } from "@env";
import { sleepRange } from "@sweetreply/shared/lib/utils";
import { botsService } from "@features/bots/service";
import { ReplyStatus } from "@sweetreply/shared/features/leads/constants";
import { ReplyResultData } from "@features/bots/types";
import { BotError, createBot } from "@sweetreply/bots";
import { BotStatus } from "@features/bots/constants";

export type ReplyQueueJobData = {
	lead_id: string;
};

const replyQueue = new Queue<ReplyQueueJobData>("reply", {
	redis: env.REDIS_URL,
	// reconsider the rate limit
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

	if (user.reply_credits <= 0) {
		await prisma.lead.update({
			where: {
				id: lead.id,
			},
			data: {
				reply_status: ReplyStatus.DRAFT,
				reply_scheduled_at: null,
				replied_at: null,
			},
		});

		return;
	}

	// the bot service cycles through each bot
	const botAccount = await botsService.getTop(lead.platform);

	if (!botAccount) {
		throw new Error(`Lead ${jobData.lead_id} could not find an account to reply with`);
	}

	const bot = createBot(botAccount);

	if (!bot) {
		// ? a platform's lead should never try to reply if it isn't supported

		await prisma.lead.update({
			where: {
				id: lead.id,
			},
			data: {
				reply_status: ReplyStatus.DRAFT,
				reply_scheduled_at: null,
				replied_at: null,
			},
		});

		return;
	}

	let replyResult: ReplyResultData;

	try {
		// generate random delay between 5000 and 10000 ms after logging in
		await bot.login();

		await sleepRange(5000, 10000);

		replyResult = await bot.reply(lead);
	} catch (err: any) {
		if (!(err instanceof BotError)) {
			throw err;
		}

		logger.error(
			{
				bot_id: botAccount.id,
				lead_id: lead.id,
				message: err.message,
			},
			"Bot error"
		);

		// this is not treated as a failure, it cancels the job and marks the lead as locked
		if (err.code === "REPLY_LOCKED") {
			await prisma.lead.update({
				where: {
					id: lead.id,
				},
				data: {
					reply_status: ReplyStatus.DRAFT,
					locked: true,
					reply_scheduled_at: null,
					replied_at: null,
				},
			});

			return;
		}

		if (err.code === "INVALID_CREDENTIALS") {
			await prisma.bot.update({
				where: {
					id: botAccount.id,
				},
				data: {
					active: false,
					status: BotStatus.INVALID_CREDENTIALS,
				},
			});
		} else if (err.code === "BANNED") {
			await prisma.bot.update({
				where: {
					id: botAccount.id,
				},
				data: {
					active: false,
					status: BotStatus.BANNED,
				},
			});
		}

		// 3 bot errors in 24 hours will make the bot inactive
		await botsService.appendError(botAccount.id, err.message);

		throw err;
	}

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
		},
		`Reply job failed`
	);

	if (job.attemptsMade === job.opts.attempts) {
		try {
			logger.info(
				{
					lead_id: jobData.lead_id,
					message: err.message,
				},
				"Reply job failed"
			);

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
