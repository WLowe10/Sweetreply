import { router } from "@/trpc";
import { getManyBotsHandler } from "./get-many";
import { checkBannedHandler } from "./check-banned";
import { getBotHandler } from "./get";
import { updateBotHandler } from "./update";
import { createBotHandler } from "./create";
import { getActiveCountsHandler } from "./get-active-counts";
// import { createManyBotsHandler } from "./create-many";

export const botsRouter = router({
	getMany: getManyBotsHandler,
	get: getBotHandler,
	getActiveCounts: getActiveCountsHandler,
	create: createBotHandler,
	// createMany: createManyBotsHandler,
	update: updateBotHandler,
	checkBanned: checkBannedHandler,
});
