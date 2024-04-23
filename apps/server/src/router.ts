import { router } from "./trpc";
import { authRouter } from "./auth/router";
import { adminRouter } from "./admin/router";
import { billingRouter } from "./features/billing/router";
import { projectsRouter } from "./features/projects/router";
import { leadsRouter } from "./features/leads/router";
import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";

export const appRouter = router({
	auth: authRouter,
	admin: adminRouter,
	billing: billingRouter,
	projects: projectsRouter,
	leads: leadsRouter,
});

export type AppRouter = typeof appRouter;
export type RouterInput = inferRouterInputs<AppRouter>;
export type RouterOutput = inferRouterOutputs<AppRouter>;
