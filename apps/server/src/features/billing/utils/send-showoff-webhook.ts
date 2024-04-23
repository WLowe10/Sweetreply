import axios from "axios";
import { env } from "@/env";

export type SendShowoffWebhookData = {
	projectName: string;
	projectId: string;
	tokens: number;
	money: string;
};

export const sendShowoffWebhook = ({
	projectName,
	projectId,
	tokens,
	money,
}: SendShowoffWebhookData) => {
	return axios.post(env.NOTIFICATION_WEBHOOK_URL, {
		content: null,
		username: "Sweetreply Notifications",
		avatar_url:
			"https://upload.wikimedia.org/wikipedia/en/thumb/f/f8/Mr._Krabs.svg/1200px-Mr._Krabs.svg.png",
		embeds: [
			{
				title: "Cha-Ching!",
				description: "A project purchased tokens!",
				color: 5814783,
				fields: [
					{
						name: "Project ID",
						value: projectId,
						inline: true,
					},
					{
						name: "Project Name",
						value: projectName,
						inline: true,
					},
					{
						name: "Tokens",
						value: tokens,
					},
					{
						name: "Money",
						value: money,
					},
				],
				footer: {
					text: "Sweetreply",
				},
				timestamp: new Date().toISOString(),
			},
		],
	});
};
