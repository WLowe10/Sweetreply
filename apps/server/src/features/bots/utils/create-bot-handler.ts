import { RedditBotHandler } from "../handlers/reddit";
import type { BotHandlerConstructor } from "../types";

export const createBotHandler = ({ bot, lead }: BotHandlerConstructor) => {
	if (lead.platform === "reddit") {
		return new RedditBotHandler({ bot, lead });
	}

	throw new Error(`Botting not supported for: ${lead.platform}`);
};
