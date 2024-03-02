import { router } from "../trpc";
import { authRouter } from "./auth/router";
import { adminRouter } from "./admin/router";

export const appRouter = router({
    auth: authRouter,
    admin: adminRouter,
});

export type AppRouter = typeof appRouter;
