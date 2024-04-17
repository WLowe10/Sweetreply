export const discordWebhookRegex =
	/^.*(discord|discordapp).com\/api\/webhooks\/([\d]+)\/([a-zA-Z0-9_.-]*)$/;

export const isDiscordWebhookURL = (target: string) => discordWebhookRegex.test(target);
