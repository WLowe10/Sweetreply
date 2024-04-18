import Queue from "bull";
import { logger } from "@/lib/logger";
import { prisma } from "@/lib/db";
import { env } from "@/env";
import { sleep } from "@sweetreply/shared/lib/utils";
import { RedditBot } from "@sweetreply/bots";
import { botsService } from "@/features/bots/service";

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
		// for now, don't retry
		attempts: 3,
	},
});

replyQueue.process(async (job) => {
	const jobData = job.data;

	logger.info(`Processing reply job for lead ${jobData.lead_id}`);

	const lead = await prisma.lead.findUnique({
		where: {
			id: jobData.lead_id,
		},
	});

	if (!lead || lead.replied_at || !lead.reply) {
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

	try {
		if (lead.platform === "reddit") {
			const replyBot = await new RedditBot({
				username: botAccount.username,
				password: botAccount.password,
			});

			await replyBot.login();

			// wait 2.5 seconds before commenting after logging in. Might be worthwile to make this slightly random
			await sleep(2500);

			// a reddit lead will have a channel (the subreddit name)

			await replyBot.comment({
				targetType: lead.type as "post" | "comment",
				postId: lead.remote_id,
				content: lead.reply,
				subredditName: lead.channel as string,
			});

			await prisma.lead.update({
				where: {
					id: lead.id,
				},
				data: {
					replied_at: new Date(),
					reply: lead.reply,
					reply_bot_id: botAccount.id,
				},
			});
		}
	} catch (err: any) {
		await prisma.botError.create({
			data: {
				bot_id: botAccount.id,
				message: err.message as string,
			},
		});

		throw err;
	}
});

replyQueue.on("failed", (job, err) => {
	logger.error(
		`Reply job [${job.id}][lead:${job.data.lead_id}] failed with error: ${err.message}`
	);
});

export { replyQueue };
