import { router } from "@/trpc";
import { getManyProjectsHandler } from "./get-many";

export const adminProjectsRouter = router({
	getMany: getManyProjectsHandler,
});
