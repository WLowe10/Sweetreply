import Queue from "bull";
import { logger } from "@lib/logger";
import { prisma } from "@lib/db";
import { env } from "@env";
import { sleep } from "@sweetreply/shared/lib/utils";
import { botsService } from "@features/bots/service";
import { createBotHandler } from "@features/bots/utils/create-bot-handler";
import { ReplyStatus } from "@sweetreply/shared/features/leads/constants";
import { ReplyResultData } from "@features/bots/types";

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
		attempts: 5,
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

	// move this bot to the bottom of the stack

	const handler = createBotHandler({ bot: botAccount, lead });

	if (!handler) {
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
		// generate random delay between 2500 and 5000 ms after logging in
		const loginDelay = Math.floor(Math.random() * (5000 - 2500 + 1)) + 2500;

		await handler.login();

		await sleep(loginDelay);

		replyResult = await handler.reply();
	} catch (err: any) {
		await botsService.appendError(botAccount.id, err.message);

		throw err;
	}

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

	logger.info(`Reply job [lead:${job.data.lead_id}] began processing`);

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

	logger.info(`Reply job [lead:${job.data.lead_id}] completed`);

	await prisma.lead.update({
		where: {
			id: jobData.lead_id,
		},
		data: {
			reply_status: ReplyStatus.REPLIED,
		},
	});
});

replyQueue.on("failed", async (job, err) => {
	const jobData = job.data;

	logger.error(`Reply job [lead:${job.data.lead_id}] failed with error: ${err.message}`);

	if (job.attemptsMade === job.opts.attempts) {
		try {
			await prisma.lead.update({
				where: {
					id: jobData.lead_id,
				},
				data: {
					reply_status: ReplyStatus.FAILED,
				},
			});
		} catch {}
	}
});

export { replyQueue };
