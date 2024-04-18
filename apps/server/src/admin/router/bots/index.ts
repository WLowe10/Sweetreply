import { router } from "@/trpc";
import { getManyBotsHandler } from "./get-many";
import { createManyBotsHandler } from "./create-many";
import { checkBannedHandler } from "./check-banned";
import { getBotHandler } from "./get";
import { updateBotHandler } from "./update";

export const botsRouter = router({
	getMany: getManyBotsHandler,
	get: getBotHandler,
	createMany: createManyBotsHandler,
	update: updateBotHandler,
	checkBanned: checkBannedHandler,
});
