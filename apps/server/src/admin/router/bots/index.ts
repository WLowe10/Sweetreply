import { router } from "@/trpc";
import { getManyBotsHandler } from "./get-many";
import { createManyBotsHandler } from "./create-many";

export const botsRouter = router({
	getMany: getManyBotsHandler,
	createMany: createManyBotsHandler,
});
