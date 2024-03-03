import { publicProcedure, router } from "../trpc";
import { authRouter } from "./auth/router";
import { adminRouter } from "./admin/router";

export const appRouter = router({
    auth: authRouter,
    admin: adminRouter,
    getDate: publicProcedure.query(() => {
        return {
            date: new Date(),
        };
    }),
});

export type AppRouter = typeof appRouter;
