import { router } from "~/trpc";
import { socialAccountsRouter } from "./social-accounts";

export const adminRouter = router({
    socialAccounts: socialAccountsRouter,
});
