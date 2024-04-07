import { router } from "@/trpc";
import { getLeadHandler } from "./get";
import { getManyLeadsHandler } from "./get-many";
import { replyToLeadHandler } from "./reply";

export const leadsRouter = router({
	get: getLeadHandler,
	getMany: getManyLeadsHandler,
	reply: replyToLeadHandler,
});
