import { router } from "@lib/trpc";
import { getManyProjectsHandler } from "./get-many";

export const adminProjectsRouter = router({
	getMany: getManyProjectsHandler,
});
