import { trpc } from "../trpc";
import { authRouter } from "./auth/router";
import { adminRouter } from "./admin/router";

export const appRouter = trpc.router({
    auth: authRouter,
    admin: adminRouter,
});

export type AppRouter = typeof appRouter;
