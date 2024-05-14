import pino from "pino";
import { isDev } from "@sweetreply/shared/lib/utils";

export const logger = pino(
	isDev()
		? {
				transport: {
					target: "pino-pretty",
					options: {
						colorize: true,
					},
				},
			}
		: undefined
);
