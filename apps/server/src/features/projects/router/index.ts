import { router } from "@/trpc";
import { getProjectHandler } from "./get";
import { getManyProjectsHandler } from "./get-many";
import { createProjectHandler } from "./create";
import { updateProjectHandler } from "./update";
import { deleteProjectHandler } from "./delete";
import { getStatsHandler } from "./get-stats";

export const projectsRouter = router({
	get: getProjectHandler,
	getMany: getManyProjectsHandler,
	create: createProjectHandler,
	update: updateProjectHandler,
	delete: deleteProjectHandler,
	getStats: getStatsHandler,
});
