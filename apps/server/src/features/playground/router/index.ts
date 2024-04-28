import { router } from "@lib/trpc";
import { generatePlaygroundReplyHandler } from "./generate-reply";

export const playgroundRouter = router({
	generateReply: generatePlaygroundReplyHandler,
});
