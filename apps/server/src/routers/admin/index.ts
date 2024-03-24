import { router } from "@/trpc";
import { usersRouter } from "./users";
import { getStatsHandler } from "./get-stats";

export const adminRouter = router({
	getStats: getStatsHandler,
	users: usersRouter,
});
