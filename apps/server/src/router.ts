import { router } from "./trpc";
import { adminRouter } from "./admin";
import { authRouter } from "./auth";
import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";

export const appRouter = router({
	admin: adminRouter,
	auth: authRouter,
});

export type AppRouter = typeof appRouter;
export type RouterInput = inferRouterInputs<AppRouter>;
export type RouterOutput = inferRouterOutputs<AppRouter>;
