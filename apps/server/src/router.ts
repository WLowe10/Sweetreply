import { router } from "~/trpc";
import { authRouter } from "~/app/auth/router";
import { adminRouter } from "~/app/admin/router";

export const appRouter = router({
    auth: authRouter,
    admin: adminRouter,
});

export type AppRouter = typeof appRouter;
