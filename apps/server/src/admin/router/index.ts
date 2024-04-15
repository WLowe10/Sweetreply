import { router } from "@/trpc";
import { usersRouter } from "./users";
import { getStatsHandler } from "./get-stats";
import { botsRouter } from "./bots";
import { sessionsRouter } from "./sessions";

export const adminRouter = router({
	getStats: getStatsHandler,
	users: usersRouter,
	sessions: sessionsRouter,
	bots: botsRouter,
});
