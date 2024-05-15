import Queue from "bull";
import { env } from "@env";
import { prisma } from "@lib/db";
import { addMinutes, isFuture, subDays } from "date-fns";
import { logger } from "@lib/logger";
import { ReplyStatus } from "@sweetreply/shared/features/leads/constants";
import { shouldReplyCompletion } from "../utils/completions/should-reply-completion";
import { replyCompletion } from "../utils/completions/reply-completion";
import { addReplyJob } from "../service";
import * as leadsService from "@features/leads/service";

export type ProcessLeadQueueJobData = {
	lead_id: string;
};

const processLeadQueue = new Queue<ProcessLeadQueueJobData>("process-lead", {
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
	// this lines up with half the openAI rate limit,
	limiter: {
		max: 40,
		duration: 1000,
	},
});

processLeadQueue.process(async (job) => {
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

	if (
		!project ||
		!project.description ||
		project.description.length < 10 ||
		user.reply_credits <= 0
	) {
		return;
	}

	// --- Generate Reply ---

	const redditAutoRepliesEnabled = lead.platform === "reddit" && project.reddit_replies_enabled;

	if (!redditAutoRepliesEnabled) {
		return;
	}

	const outstandingReplies = await leadsService.countOutstandingRepliesForUser(user.id);

	if (outstandingReplies >= user.reply_credits) {
		logger.info(`${user.email} has reached the reply limit in outstanding replies`);

		return;
	}

	// if the daily limit is zero, it means that the project does not have a reply limit
	if (project.reply_daily_limit >= 0) {
		// counts all of the scheduled and sent replies within the last 24 hours

		const repliesLast24Hours = await prisma.lead.count({
			where: {
				project_id: project.id,
				reply_status: {
					in: [ReplyStatus.SCHEDULED, ReplyStatus.REPLIED],
				},
				OR: [
					{
						replied_at: {
							gte: subDays(new Date(), 1),
						},
					},
					{
						reply_scheduled_at: {
							gte: subDays(new Date(), 1),
						},
					},
				],
			},
		});

		if (repliesLast24Hours >= project.reply_daily_limit) {
			// daily limit reached, don't generate a reply
			logger.info(`${project.name} has reached the daily reply limit`);

			return;
		}
	}

	// check if we should reply to this lead using AI
	const shouldReply = await shouldReplyCompletion({ lead, project });

	if (!shouldReply) {
		return;
	}

	// generate the reply using AI
	const generatedReply = await replyCompletion({ lead, project });

	let scheduledAt: Date | undefined;

	if (project.reply_delay > 0) {
		const replyDate = addMinutes(lead.date, project.reply_delay);

		if (isFuture(replyDate)) {
			scheduledAt = replyDate;
		}
	}

	// send the lead to the reply queue
	addReplyJob(lead.id, {
		date: scheduledAt,
	});

	await prisma.lead.update({
		where: {
			id: lead.id,
		},
		data: {
			reply_status: ReplyStatus.SCHEDULED,
			reply_text: generatedReply,
			reply_scheduled_at: scheduledAt,
			replies_generated: {
				increment: 1,
			},
		},
	});
});

export { processLeadQueue };
