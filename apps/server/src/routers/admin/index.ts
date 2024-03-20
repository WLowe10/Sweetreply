import { router } from "@/trpc";
import { usersRouter } from "./users";

export const adminRouter = router({
	users: usersRouter,
});
