import { router } from "@/trpc";
import { usersRouter } from "./users";
import { getStatsHandler } from "./get-stats";
import { botsRouter } from "./bots";
import { sessionsRouter } from "./sessions";
import { adminProjectsRouter } from "./projects";

export const adminRouter = router({
	getStats: getStatsHandler,
	users: usersRouter,
	sessions: sessionsRouter,
	projects: adminProjectsRouter,
	bots: botsRouter,
});
