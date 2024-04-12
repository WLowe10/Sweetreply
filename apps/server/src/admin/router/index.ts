import { router } from "@/trpc";
import { usersRouter } from "./users";
import { getStatsHandler } from "./get-stats";
import { botsRouter } from "./bots";

export const adminRouter = router({
	getStats: getStatsHandler,
	users: usersRouter,
	bots: botsRouter,
});
