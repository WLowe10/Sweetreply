import "dotenv/config";
import "reflect-metadata";
import express from "express";
import helmet from "helmet";
import cors from "cors";
import * as trpcExpress from "@trpc/server/adapters/express";
import { env } from "./env";
import { createContext } from "./trpc";
import { startJobs } from "./jobs";
import { appRouter } from "./routers";
import { logger } from "./lib/logger";
import { useExpressServer } from "routing-controllers";
import { StripeController } from "./controllers/stripe";

async function bootstrap() {
    const app = express();

    app.use(helmet());
    app.use(
        cors({
            origin: env.FRONTEND_URL,
            credentials: true,
        })
    );

    app.use(
        express.json({
            verify: (req, res, buf) => {
                // @ts-ignore
                req.rawBody = buf;
            },
        })
    );

    useExpressServer(app, {
        controllers: [StripeController],
    });

    app.use(
        "/trpc",
        trpcExpress.createExpressMiddleware({
            router: appRouter,
            createContext,
        })
    );

    if (!env.JOBS_DISABLED) {
        logger.info("Starting jobs");
        startJobs();
    }

    app.listen(env.PORT || 3000, () => {
        logger.info(`Server started on port ${env.PORT || 3000}`);
    });
}

bootstrap();
