import { router } from "./lib/trpc";
import { authRouter } from "./features/auth/router";
import { adminRouter } from "./features/admin/router";
import { billingRouter } from "./features/billing/router";
import { projectsRouter } from "./features/projects/router";
import { leadsRouter } from "./features/leads/router";
import { playgroundRouter } from "./features/playground/router";
import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";

export const appRouter = router({
	auth: authRouter,
	admin: adminRouter,
	billing: billingRouter,
	projects: projectsRouter,
	leads: leadsRouter,
	playground: playgroundRouter,
});

export type AppRouter = typeof appRouter;
export type RouterInput = inferRouterInputs<AppRouter>;
export type RouterOutput = inferRouterOutputs<AppRouter>;
