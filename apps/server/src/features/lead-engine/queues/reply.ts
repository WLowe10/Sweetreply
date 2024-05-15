import Queue from "bull";
import * as botsService from "@features/bots/service";
import * as leadsService from "@features/leads/service";
import { logger } from "@lib/logger";
import { prisma } from "@lib/db";
import { env } from "@env";
import { ReplyStatus } from "@sweetreply/shared/features/leads/constants";
import { ReplyResultData } from "@features/bots/types";
import { BotError } from "@sweetreply/bots";

export type ReplyQueueJobData = {
	lead_id: string;
};

const replyQueue = new Queue<ReplyQueueJobData>("reply", {
	redis: env.REDIS_URL,
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

replyQueue.process(3, async (job) => {
	const jobData = job.data;

	const lead = await prisma.lead.findUnique({
		where: {
			id: jobData.lead_id,
		},
		include: {
			project: {
				include: {
					user: true,
				},
			},
		},
	});

	if (!lead) {
		return;
	}

	const project = lead.project;
	const user = project.user;

	if (lead.reply_status === ReplyStatus.REPLIED) {
		return;
	}

	if (user.reply_credits <= 0) {
		await leadsService.draft(lead.id);

		return;
	}

	if (lead.reply_text === null) {
		job.opts.attempts = job.attemptsMade + 1;

		throw new Error(`Lead ${jobData.lead_id} has insufficient reply text`);
	}

	// the bot service cycles through each bot
	const botAccount = await botsService.dequeueBot(lead.platform);

	// --- Automation ----

	let replyResult: ReplyResultData | undefined;

	try {
		await botsService.executeBot(botAccount, async (bot) => {
			replyResult = await bot.reply(lead as any);
		});
	} catch (err) {
		if (err instanceof BotError && err.code === "REPLY_LOCKED") {
			await leadsService.lock(lead.id);
		}

		throw err;
	}

	if (!replyResult) {
		throw new Error("Failed to reply");
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
		// deduct the reply credit from the user
		await leadsService.deductReplyCreditFromUser(user.id);
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
