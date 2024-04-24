import Queue from "bull";
import axios from "axios";
import { env } from "@/env";
import { prisma } from "@/lib/db";
import { replyQueue } from "./reply";
import { isDiscordWebhookURL } from "@/lib/regex";
import { buildFrontendUrl } from "@/lib/utils";
import { addMinutes, differenceInMilliseconds, isFuture, subDays } from "date-fns";
import { logger } from "@/lib/logger";
import { replyStatus } from "@sweetreply/shared/features/leads/constants";
import { shouldReplyCompletion } from "../utils/completions/should-reply-completion";
import { replyCompletion } from "../utils/completions/reply-completion";

export type ProcessLeadQueueJobData = {
	lead_id: string;
};

const processLeadQueue = new Queue<ProcessLeadQueueJobData>("process-lead", {
	redis: env.REDIS_URL,
	defaultJobOptions: {
		attempts: 3,
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

	// --- Send webhook ---
	// At this time, we don't care if a webhook fails

	if (project.webhook_url) {
		try {
			if (isDiscordWebhookURL(project.webhook_url)) {
				await axios.post(project.webhook_url, {
					username: "Sweetreply",
					avatar_url: "https://media.tenor.com/ueHM2kR20QQAAAAM/high-cat.gif",
					content: null,
					embeds: [
						{
							title: "New lead detected!",
							url: buildFrontendUrl(`/leads/${lead.id}`),
							color: 3447003,
							fields: [
								{
									name: "Project",
									value: project.name,
								},
								{
									name: "Platform",
									value: lead.platform,
									inline: true,
								},
								{
									name: "Subreddit",
									value: lead.channel,
									inline: true,
								},
								{
									name: "Username",
									value: lead.username,
								},
								{
									name: "Title",
									value: lead.title?.substring(0, 100),
								},
								{
									name: "Content",
									value: lead.content.substring(0, 100),
								},
							],
						},
					],
				});
			} else {
				await axios.post(project.webhook_url, {
					project_id: project.id,
					lead: lead,
				});
			}
		} catch {
			// noop
		}
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
			reply_status: replyStatus.REPLIED,
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
	let delay = 0;

	if (project.reply_delay > 0) {
		const replyDate = addMinutes(lead.date, project.reply_delay);

		if (isFuture(replyDate)) {
			scheduledAt = replyDate;
			delay = differenceInMilliseconds(replyDate, new Date());
		}
	}

	await prisma.lead.update({
		where: {
			id: lead.id,
		},
		data: {
			reply_status: replyStatus.SCHEDULED,
			reply_text: generatedReply,
			reply_scheduled_at: scheduledAt,
			replies_generated: {
				increment: 1,
			},
		},
	});

	replyQueue.add(
		{ lead_id: lead.id },
		{
			jobId: lead.id,
			delay,
		}
	);
});

export { processLeadQueue };
