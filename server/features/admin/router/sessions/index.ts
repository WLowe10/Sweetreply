import { router } from "~/lib/trpc";
import { getManySessionsHandler } from "./get-many";

export const sessionsRouter = router({
	getMany: getManySessionsHandler,
});
