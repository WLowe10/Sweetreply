import { router } from "./trpc";
import { adminRouter } from "./admin/router";
import { authRouter } from "./auth/router";
import { projectsRouter } from "./features/projects/router";
import { leadsRouter } from "./features/leads/router";
import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";

export const appRouter = router({
	admin: adminRouter,
	auth: authRouter,
	projects: projectsRouter,
	leads: leadsRouter,
});

export type AppRouter = typeof appRouter;
export type RouterInput = inferRouterInputs<AppRouter>;
export type RouterOutput = inferRouterOutputs<AppRouter>;
