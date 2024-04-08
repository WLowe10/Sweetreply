import { router } from "@/trpc";
import { usersRouter } from "./users";
import { getStatsHandler } from "./get-stats";
import { socialAccountsRouter } from "./social-accounts";

export const adminRouter = router({
	getStats: getStatsHandler,
	users: usersRouter,
	socialAccounts: socialAccountsRouter,
});
