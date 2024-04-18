import Queue from "bull";
import { env } from "@/env";
import { prisma } from "@/lib/db";
import { generateReplyCompletion } from "../utils/generate-reply-completion";
import { replyQueue } from "./reply";
import axios from "axios";
import { isDiscordWebhookURL } from "@/lib/regex";
import { buildFrontendUrl } from "@/lib/utils";
import { projectsService } from "@/features/projects/service";

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

	// add more checks here once other platforms are supported
	if (shouldGenerateRedditReply) {
		console.log("generating reply");

		const result = await generateReplyCompletion({ lead, project });

		// deduct token after generating reply
		await projectsService.deductToken(project.id);

		await prisma.lead.update({
			where: {
				id: lead.id,
			},
			data: {
				reply: result.reply,
			},
		});

		if (result.shouldReply) {
			// sends the lead to the reply queue after generating the reply
			// replyQueue.add(
			// 	{ lead_id: lead.id },
			// 	{
			// 		delay: 60000,
			// 	}
			// );
		}
	}
});

export { processLeadQueue };
