import { router } from "@/trpc";
import { generatePlaygroundReplyHandler } from "./generate-reply";

export const playgroundRouter = router({
	generateReply: generatePlaygroundReplyHandler,
});
