import { router } from "../trpc";
import { adminRouter } from "./admin";
import { authRouter } from "./auth";

export const appRouter = router({
	admin: adminRouter,
	auth: authRouter,
});

export type AppRouter = typeof appRouter;
