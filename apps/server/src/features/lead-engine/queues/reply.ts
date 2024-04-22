import Queue from "bull";
import { logger } from "@/lib/logger";
import { prisma } from "@/lib/db";
import { env } from "@/env";
import { sleep } from "@sweetreply/shared/lib/utils";
import { botsService } from "@/features/bots/service";
import { projectsService } from "@/features/projects/service";
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
		attempts: 3,
		removeOnComplete: true,
		removeOnFail: true,
	},
});

replyQueue.process(async (job) => {
	const jobData = job.data;

	const lead = await prisma.lead.findUnique({
		where: {
			id: jobData.lead_id,
		},
	});

	if (!lead || lead.replied_at || !lead.reply_text) {
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
		await handler.login();

		await sleep(2500);

		const result = await handler.reply();

		await prisma.lead.update({
			where: {
				id: lead.id,
			},
			data: {
				reply_status: "replied",
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

	// the reply was successful, now deduct the token
	await projectsService.deductToken(project.id);
});

replyQueue.on("active", async (job, jobPromise) => {
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

	// const lead = await prisma.lead.findUnique({
	// 	where: {
	// 		id: jobData.lead_id,
	// 	},
	// });
	// if (!lead) {
	// 	return;
	// }
	// await projectsService.deductToken(lead.project_id);
});

replyQueue.on("failed", async (job, err) => {
	const jobData = job.data;

	logger.error(
		`Reply job [${job.id}][lead:${job.data.lead_id}] failed with error: ${err.message}`
	);

	await prisma.lead.update({
		where: {
			id: jobData.lead_id,
		},
		data: {
			reply_status: "failed",
		},
	});
});

replyQueue.on("removed", (job) => {
	console.log(`Removed job ${job.id}`);
});

export { replyQueue };
