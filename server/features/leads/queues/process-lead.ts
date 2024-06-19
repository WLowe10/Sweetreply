import Queue from "bull";
import { env } from "~/env";
import { prisma } from "~/lib/prisma";
import { addHours, addMinutes, isFuture, subDays } from "date-fns";
import { ReplyStatus } from "~/features/leads/constants";
import { shouldReplyCompletion } from "../lib/completions/should-reply-completion";
import { replyCompletion } from "../lib/completions/reply-completion";
import { BotAction } from "../constants";
import { randomRange } from "@shared/utils";
import * as leadsService from "~/features/leads/service";

export type ProcessLeadQueueJobData = {
	lead_id: string;
};

export const processLeadQueue = new Queue<ProcessLeadQueueJobData>("process-lead", {
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
	// this lines up with half of the openAI rate limit,
	limiter: {
		max: 40,
		duration: 1000,
	},
});

processLeadQueue.process(async job => {
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

	if (!project.description || project.description.length < 10 || user.reply_credits <= 0) {
		return;
	}

	// --- Generate Reply ---

	const redditAutoRepliesEnabled = lead.platform === "reddit" && project.reddit_replies_enabled;

	if (!redditAutoRepliesEnabled) {
		return;
	}

	const outstandingReplies = await leadsService.countOutstandingRepliesForUser(user.id);

	if (outstandingReplies >= user.reply_credits) {
		// the user will not have enough reply credits from their outstanding replies
		return;
	}

	// --- schedule a date to send the reply ---

	// add random minutes to the scheduled date so the replies aren't exactly n hours after the post
	let scheduledDate = addMinutes(lead.date, randomRange(1, 30));

	// add either the project's reply delay, or between 8 and 10 hours
	scheduledDate = addHours(
		scheduledDate,
		typeof project.reply_delay === "number" ? project.reply_delay : randomRange(8, 10)
	);

	// if the daily limit is zero, it means that the project does not have a reply limit
	if (project.reply_daily_limit >= 0) {
		// counts all of the scheduled and sent replies within the last 24 hours

		const repliesInScheduled24HourPeriod = await prisma.lead.count({
			where: {
				project_id: project.id,
				OR: [
					{
						reply_status: ReplyStatus.REPLIED,
						replied_at: {
							gte: subDays(scheduledDate, 1),
							lte: scheduledDate,
						},
					},
					{
						reply_status: ReplyStatus.SCHEDULED,
						reply_scheduled_at: {
							gte: subDays(scheduledDate, 1),
							lte: scheduledDate,
						},
					},
				],
			},
		});

		if (repliesInScheduled24HourPeriod >= project.reply_daily_limit) {
			// daily limit reached, don't generate a reply
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

	// send the lead to the reply queue
	leadsService.addBotActionJob(lead.id, BotAction.REPLY, {
		date: isFuture(scheduledDate) ? scheduledDate : undefined,
	});

	await prisma.lead.update({
		where: {
			id: lead.id,
		},
		data: {
			reply_status: ReplyStatus.SCHEDULED,
			reply_text: generatedReply,
			reply_scheduled_at: scheduledDate,
			replies_generated: {
				increment: 1,
			},
		},
	});
});
