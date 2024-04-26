import Queue from "bull";
import { logger } from "@/lib/logger";
import { prisma } from "@/lib/db";
import { env } from "@/env";
import { sleep } from "@sweetreply/shared/lib/utils";
import { botsService } from "@/features/bots/service";
import { createBotHandler } from "@/features/bots/utils/create-bot-handler";
import { replyStatus } from "@sweetreply/shared/features/leads/constants";

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
		// attempts: 5,
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

	console.log("replying");

	const lead = await prisma.lead.findUnique({
		where: {
			id: jobData.lead_id,
		},
	});

	if (!lead) {
		await job.discard();
		return;
	}

	if (lead.reply_status === replyStatus.REPLIED) {
		await job.discard();
		return;
	}

	if (!lead.reply_text || lead.reply_text.trim().length === 0) {
		job.moveToFailed({ message: "Reply text is empty" });
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
		return;
	}

	try {
		// generate random delay between 2500 and 5000 ms after logging in
		const loginDelay = Math.floor(Math.random() * (5000 - 2500 + 1)) + 2500;

		await handler.login();

		await sleep(loginDelay);

		const result = await handler.reply();

		await prisma.lead.update({
			where: {
				id: lead.id,
			},
			data: {
				reply_status: replyStatus.REPLIED,
				replied_at: new Date(),
				reply_remote_id: result.reply_remote_id,
				reply_scheduled_at: null,
				reply_bot_id: botAccount.id,
			},
		});
	} catch (err: any) {
		await botsService.appendError(botAccount.id, err.message);

		throw err;
	}
});

replyQueue.on("active", async (job) => {
	const jobData = job.data;

	logger.info(`Processing reply job for lead ${jobData.lead_id}`);

	// todo check the project can reply, otherwise cancel and set status to draft

	await prisma.lead.update({
		where: {
			id: jobData.lead_id,
		},
		data: {
			reply_status: replyStatus.PENDING,
		},
	});
});

replyQueue.on("completed", async (job) => {
	const jobData = job.data;

	logger.info(`Completed reply job for lead ${jobData.lead_id}`);

	const lead = await prisma.lead.findUnique({
		where: {
			id: jobData.lead_id,
		},
	});

	if (!lead) {
		return;
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
			id: project?.user_id,
		},
	});

	if (!user) {
		return;
	}

	await prisma.user.update({
		where: {
			id: user.id,
		},
		data: {
			reply_credits: {
				decrement: 1,
			},
		},
	});
});

replyQueue.on("failed", async (job, err) => {
	const jobData = job.data;

	logger.error(
		`Reply job [${job.id}][lead:${job.data.lead_id}] failed with error: ${err.message}`
	);

	if (job.attemptsMade === job.opts.attempts) {
		await prisma.lead.update({
			where: {
				id: jobData.lead_id,
			},
			data: {
				reply_status: replyStatus.FAILED,
			},
		});
	}
});

replyQueue.on("removed", (job) => {
	console.log(`Removed job ${job.id}`);
});

export { replyQueue };
