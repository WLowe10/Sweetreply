import axios from "axios";
import { env } from "@env";

export type SendShowoffWebhookData = {
	userID: string;
	userEmail: string;
	money: string;
};

export const sendShowoffWebhook = ({ userID, userEmail, money }: SendShowoffWebhookData) => {
	return axios.post(env.NOTIFICATION_WEBHOOK_URL, {
		content: null,
		username: "Sweetreply Notifications",
		avatar_url:
			"https://upload.wikimedia.org/wikipedia/en/thumb/f/f8/Mr._Krabs.svg/1200px-Mr._Krabs.svg.png",
		embeds: [
			{
				title: "Cha-Ching!",
				description: "💸 Invoice paid, money made! 💸",
				color: 5814783,
				fields: [
					{
						name: "User ID",
						value: userID,
					},
					{
						name: "User email",
						value: userEmail,
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
