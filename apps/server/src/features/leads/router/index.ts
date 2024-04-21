import { router } from "@/trpc";
import { getLeadHandler } from "./get";
import { getManyLeadsHandler } from "./get-many";
import { replyToLeadHandler } from "./reply";
import { deleteReplyHandler } from "./delete-reply";
import { editReplyHandler } from "./edit-reply";

export const leadsRouter = router({
	get: getLeadHandler,
	getMany: getManyLeadsHandler,
	editReply: editReplyHandler,
	reply: replyToLeadHandler,
	deleteReply: deleteReplyHandler,
});
