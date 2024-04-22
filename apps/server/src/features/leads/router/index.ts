import { router } from "@/trpc";
import { getLeadHandler } from "./get";
import { getManyLeadsHandler } from "./get-many";
import { sendReplyHandler } from "./send-reply";
import { undoReplyHandler } from "./undo-reply";
import { editReplyHandler } from "./edit-reply";
import { cancelReplyHandler } from "./cancel-reply";

export const leadsRouter = router({
	get: getLeadHandler,
	getMany: getManyLeadsHandler,

	// --- Reply Actions ---
	sendReply: sendReplyHandler,
	editReply: editReplyHandler,
	undoReply: undoReplyHandler,
	cancelReply: cancelReplyHandler,
});
