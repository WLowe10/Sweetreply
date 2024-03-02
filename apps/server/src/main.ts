import "dotenv/config";
import express from "express";
import helmet from "helmet";
import * as trpcExpress from "@trpc/server/adapters/express";
import { env } from "./env";
import { createContext } from "./trpc";
import { appRouter } from "./app";
import { logger } from "./lib/logger";
import { isDev } from "./lib/utils";

async function bootstrap() {
    const app = express();

    app.use(helmet());
    // app.use(cors()); // ? i think helmet already includes cors

    app.use(
        "/trpc",
        trpcExpress.createExpressMiddleware({
            router: appRouter,
            createContext,
        })
    );

    console.log("is-dev", isDev());

    app.listen(env.PORT || 3000, () => {
        logger.info(`Server started on port ${env.PORT || 3000}`);
    });
}

bootstrap();
