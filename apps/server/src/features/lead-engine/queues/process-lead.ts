import Queue from "bull";
import { env } from "@/env";
import { prisma } from "@/lib/db";
import { generateReplyCompletion } from "../utils/generate-reply-completion";
import { replyQueue } from "./reply";
import axios from "axios";
import { isDiscordWebhookURL } from "@/lib/regex";
import { buildFrontendUrl } from "@/lib/utils";
import {
	addMilliseconds,
	addMinutes,
	differenceInMilliseconds,
	isBefore,
	isFuture,
	isPast,
	millisecondsToMinutes,
	subDays,
} from "date-fns";
import { logger } from "@/lib/logger";

export type ProcessLeadQueueJobData = {
	lead_id: string;
};

const processLeadQueue = new Queue<ProcessLeadQueueJobData>("generate-reply", {
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
				console.log("sending discord webhook");

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
			reply_status: "replied",
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

	console.log("generating reply");

	const result = await generateReplyCompletion({ lead, project });

	console.log(result.shouldReply);

	// add reply text

	if (result.shouldReply && typeof result.reply !== "undefined") {
		let scheduledAt = null;
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
				reply_status: delay > 0 ? "scheduled" : "pending",
				reply_text: result.reply,
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
	}
});

export { processLeadQueue };
