import { router } from "@lib/trpc";
import { getLeadHandler } from "./get";
import { getManyLeadsHandler } from "./get-many";
import { deleteLeadHandler } from "./delete";
import { sendReplyHandler } from "./send-reply";
import { undoReplyHandler } from "./undo-reply";
import { editReplyHandler } from "./edit-reply";
import { cancelReplyHandler } from "./cancel-reply";
import { generateReplyHandler } from "./generate-reply";

export const leadsRouter = router({
	get: getLeadHandler,
	getMany: getManyLeadsHandler,
	delete: deleteLeadHandler,

	// --- Reply Actions ---
	generateReply: generateReplyHandler,
	sendReply: sendReplyHandler,
	editReply: editReplyHandler,
	undoReply: undoReplyHandler,
	cancelReply: cancelReplyHandler,
});
