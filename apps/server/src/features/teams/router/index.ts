import { router } from "@/trpc";
import { getManyTeamsHandler } from "./get-many";
import { createTeamHandler } from "./create";
import { updateTeamHandler } from "./update";
import { leaveTeamHandler } from "./leave";
import { getTeamHandler } from "./get";

export const teamsRouter = router({
	get: getTeamHandler,
	getMany: getManyTeamsHandler,
	create: createTeamHandler,
	update: updateTeamHandler,
	leave: leaveTeamHandler,
});
