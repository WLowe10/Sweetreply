import "dotenv/config";
import express from "express";
import helmet from "helmet";
import cors from "cors";
import * as trpcExpress from "@trpc/server/adapters/express";
import { env } from "./env";
import { createContext } from "./trpc";
import { startJobs } from "./jobs";
import { appRouter } from "./app";
import { logger } from "./lib/logger";

async function bootstrap() {
    const app = express();

    startJobs();

    app.use(helmet());
    app.use(cors());

    app.use(
        "/trpc",
        trpcExpress.createExpressMiddleware({
            router: appRouter,
            createContext,
        })
    );

    app.listen(env.PORT || 3000, () => {
        logger.info(`Server started on port ${env.PORT || 3000}`);
    });
}

bootstrap();
