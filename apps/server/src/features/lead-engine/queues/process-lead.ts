import Queue from "bull";
import { env } from "@env";
import { prisma } from "@lib/db";
import { addMinutes, isFuture, subDays } from "date-fns";
import { logger } from "@lib/logger";
import { ReplyStatus } from "@sweetreply/shared/features/leads/constants";
import { shouldReplyCompletion } from "../utils/completions/should-reply-completion";
import { replyCompletion } from "../utils/completions/reply-completion";
import { addReplyJob } from "../utils/add-reply-job";

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
});

processLeadQueue.process(async (job) => {
	const jobData = job.data;

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
			id: project.user_id,
		},
	});

	if (!user) {
		return;
	}

	// the account does not have an active subscription, or does not have any reply credits. Do not proceed in auto replies
	if (user.reply_credits <= 0) {
		return;
	}

	// --- Generate Reply ---

	const shouldGenerateRedditReply = lead.platform === "reddit" && project.reddit_replies_enabled;

	if (!shouldGenerateRedditReply) {
		return;
	}

	// if the daily limit is zero, it means that the project does not have a reply limit
	// add more checks here once other platforms are supported

	// counts all of the replies within the last 24 hours
	const repliesLast24Hours = await prisma.lead.count({
		where: {
			reply_status: ReplyStatus.REPLIED,
			replied_at: {
				gte: subDays(new Date(), 1),
			},
		},
	});

	if (project.reply_daily_limit && repliesLast24Hours >= project.reply_daily_limit) {
		// daily limit reached, don't generate a reply
		logger.info(`${project.name} has reached the daily reply limit`);

		return;
	}

	const shouldReply = await shouldReplyCompletion({ lead, project });

	if (!shouldReply) {
		return;
	}

	const generatedReply = await replyCompletion({ lead, project });

	if (generatedReply.length === 0) {
		return;
	}

	let scheduledAt = new Date();

	if (project.reply_delay > 0) {
		const replyDate = addMinutes(lead.date, project.reply_delay);

		if (isFuture(replyDate)) {
			scheduledAt = replyDate;

			addReplyJob(lead.id, {
				date: scheduledAt,
			});
		}
	} else {
		addReplyJob(lead.id);
	}

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
