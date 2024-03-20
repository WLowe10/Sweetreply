import { publicProcedure, router } from "../trpc";
import { adminRouter } from "./admin";
import { authRouter } from "./auth";

export const appRouter = router({
	helloWorld: publicProcedure.query(() => {
		return Date.now();
	}),
	admin: adminRouter,
	auth: authRouter,
});

export type AppRouter = typeof appRouter;
