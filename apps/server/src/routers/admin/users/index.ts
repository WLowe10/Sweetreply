import { router } from "@/trpc";
import { getManyUsersHandler } from "./get-many";

export const usersRouter = router({
	getMany: getManyUsersHandler,
});
