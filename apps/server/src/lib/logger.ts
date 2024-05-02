import pino from "pino";
import { isDev } from "./utils";

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
