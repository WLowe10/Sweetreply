import Queue from "bull";
import { logger } from "@/lib/logger";
import { prisma } from "@/lib/db";
import { env } from "@/env";
import { sleep } from "@sweetreply/shared/lib/utils";
import { RedditBot } from "@sweetreply/bots";

export type ReplyQueueJobData = {
	lead_id: string;
	content: string;
};

const replyQueue = new Queue<ReplyQueueJobData>("reply", {
	redis: env.REDIS_URL,
	// reconsider the rate limit
	limiter: {
		max: 1,
		duration: 1000,
	},
	defaultJobOptions: {
		attempts: 1,
	},
});

replyQueue.process(async (job) => {
	const jobData = job.data;

	logger.info(`Processing reply job for lead ${job.data.lead_id}`);

	const lead = await prisma.lead.findUnique({
		where: {
			id: jobData.lead_id,
		},
	});

	if (!lead) {
		throw new Error(`Lead ${jobData.lead_id} not found`);
	}

	if (lead.replied_at) {
		throw new Error(`Lead ${jobData.lead_id} already has a reply`);
	}

	const project = await prisma.project.findUnique({
		where: {
			id: lead.project_id,
		},
	});

	if (!project) {
		throw new Error("Project not found");
	}

	// the lead engine cycles through each bot
	const botAccount = await prisma.bot.findFirst({
		where: {
			platform: lead.platform,
			active: true,
		},
		orderBy: {
			last_used_at: "asc",
		},
	});

	if (!botAccount) {
		throw new Error(`Lead ${jobData.lead_id} could not find an account to reply with`);
	}

	// move this bot to the bottom of the stack
	await prisma.bot.update({
		where: {
			id: botAccount.id,
		},
		data: {
			last_used_at: new Date(),
		},
	});

	if (lead.platform === "reddit") {
		const replyBot = await new RedditBot(botAccount);

		console.log("logging in");
		await replyBot.login();

		// wait 2.5 seconds before commenting after logging in. Might be worthwile to make this slightly random
		await sleep(2500);

		// a reddit lead will have a channel (the subreddit name)
		console.log("commenting");

		await replyBot.comment({
			postId: lead.remote_id,
			content: jobData.content,
			subredditName: lead.channel as string,
		});

		await prisma.lead.update({
			where: {
				id: lead.id,
			},
			data: {
				replied_at: new Date(),
				reply: jobData.content,
				reply_bot_id: botAccount.id,
			},
		});
	}

	// logger.info(`Replying to lead ${lead_id} with bot account ${bot.username}`);
});

export { replyQueue };
