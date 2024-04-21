import { RedditBotHandler } from "../handlers/reddit";
import type { BotHandlerConstructor, IBotHandler } from "../types";

export const createBotHandler = ({ bot, lead }: BotHandlerConstructor): IBotHandler | null =>
	lead.platform === "reddit" ? new RedditBotHandler({ bot, lead }) : null;
