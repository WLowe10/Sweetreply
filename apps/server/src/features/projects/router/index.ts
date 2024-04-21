import { router } from "@/trpc";
import { getProjectHandler } from "./get";
import { getManyProjectsHandler } from "./get-many";
import { createProjectHandler } from "./create";
import { updateProjectHandler } from "./update";
import { deleteProjectHandler } from "./delete";
import { getStatsHandler } from "./get-stats";
import { subscribeHandler } from "./subscribe";
import { getBillingPortalHandler } from "./get-billing-portal";
// import { buyTokensHandler } from "./buy-tokens";

export const projectsRouter = router({
	get: getProjectHandler,
	getMany: getManyProjectsHandler,
	create: createProjectHandler,
	update: updateProjectHandler,
	delete: deleteProjectHandler,
	getStats: getStatsHandler,

	subscribe: subscribeHandler,
	getBillingPortal: getBillingPortalHandler,
	// buyTokens: buyTokensHandler,
});
