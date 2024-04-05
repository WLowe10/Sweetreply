import { router } from "./trpc";
import { adminRouter } from "./admin";
import { authRouter } from "./auth";
import { teamsRouter } from "./features/teams/router";
import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";

export const appRouter = router({
	admin: adminRouter,
	auth: authRouter,
	teams: teamsRouter,
});

export type AppRouter = typeof appRouter;
export type RouterInput = inferRouterInputs<AppRouter>;
export type RouterOutput = inferRouterOutputs<AppRouter>;
