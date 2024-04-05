import { router } from "@/trpc";
import { getManySessionsHandler } from "./get-many";

export const sessionsRouter = router({
	getMany: getManySessionsHandler,
});
