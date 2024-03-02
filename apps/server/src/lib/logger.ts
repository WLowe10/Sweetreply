import pino from "pino";

// set a different transport during development

export const logger = pino({
    transport: {
        target: "pino-pretty",
        options: {
            colorize: true,
        },
    },
});
