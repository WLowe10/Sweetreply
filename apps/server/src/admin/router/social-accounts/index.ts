import { router } from "@/trpc";
import { getManySocialAccountsHandler } from "./get-many";
import { createManySocialAccountsHandler } from "./create-many";

export const socialAccountsRouter = router({
	getMany: getManySocialAccountsHandler,
	createMany: createManySocialAccountsHandler,
});
