import axios from "axios";
import Queue from "bull";
import { prisma } from "@lib/prisma";
import { isDiscordWebhookURL } from "@lib/regex";
import { buildFrontendUrl } from "@utils";
import { env } from "@env";

export type SendLeadWebhookJobData = {
	lead_id: string;
};

export const sendLeadWebhookQueue = new Queue<SendLeadWebhookJobData>("send-lead-webhook", {
	redis: env.REDIS_URL,
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
		include: {
			project: true,
		},
	});

	if (!lead) {
		return;
	}

	const project = lead.project;

	if (!project.webhook_url) {
		return;
	}

	if (isDiscordWebhookURL(project.webhook_url)) {
		await axios.post(project.webhook_url, {
			username: "Sweetreply",
			avatar_url: "https://www.sweetreply.io/icon.png",
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
							value: lead.group,
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
			event: "lead.created",
			project: project.id,
			data: {
				id: lead.id,
				platform: lead.platform,
				type: lead.type,
				group: lead.group,
				username: lead.username,
				name: lead.name,
				title: lead.title,
				content: lead.content,
				date: lead.date,
				created_at: lead.created_at,
				remote_url: lead.remote_url,
				remote_user_id: lead.remote_user_id,
				remote_id: lead.remote_id,
				remote_parent_id: lead.remote_parent_id,
				remote_group_id: lead.remote_group_id,
			},
		});
	}
});
