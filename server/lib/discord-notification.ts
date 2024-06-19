import axios from "axios";
import { env } from "~/env";

export type DiscordField = {
	name: string;
	value: string;
	inline?: boolean;
};

export type SendDiscordNotificationData = {
	title: string;
	description: string;
	fields: DiscordField[];
	color?: number;
	username?: string;
};

export const sendDiscordNotification = ({
	title,
	username,
	description,
	color,
	fields,
}: SendDiscordNotificationData) => {
	return axios.post(env.NOTIFICATION_WEBHOOK_URL, {
		content: null,
		username: username ?? "Sweetreply Notifications",
		avatar_url:
			"https://upload.wikimedia.org/wikipedia/en/thumb/f/f8/Mr._Krabs.svg/1200px-Mr._Krabs.svg.png",
		embeds: [
			{
				title,
				description,
				fields,
				color: color ?? 5814783,
				footer: {
					text: "Sweetreply",
				},
				timestamp: new Date().toISOString(),
			},
		],
	});
};
