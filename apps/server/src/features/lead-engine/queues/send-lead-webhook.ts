import { prisma } from "@/lib/db";
import { isDiscordWebhookURL } from "@/lib/regex";
import { buildFrontendUrl } from "@/lib/utils";
import axios from "axios";
import Queue from "bull";

export type SendLeadWebhookJobData = {
	lead_id: string;
};

export const sendLeadWebhookQueue = new Queue<SendLeadWebhookJobData>("send-lead-webhook", {
	defaultJobOptions: {
		attempts: 1,
		removeOnComplete: true,
		removeOnFail: true,
	},
});

sendLeadWebhookQueue.process(async (job) => {
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

	if (!project.webhook_url) {
		return;
	}

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
});
