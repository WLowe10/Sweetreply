import { router } from "@/trpc";
import { createSocialAccountHandler } from "./create";

export const socialAccountsRouter = router({
    create: createSocialAccountHandler,
});
