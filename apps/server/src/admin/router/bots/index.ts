import { router } from "@/trpc";
import { getManyBotsHandler } from "./get-many";
import { createManyBotsHandler } from "./create-many";
import { checkBannedHandler } from "./check-banned";

export const botsRouter = router({
	getMany: getManyBotsHandler,
	createMany: createManyBotsHandler,
	checkBanned: checkBannedHandler,
});
