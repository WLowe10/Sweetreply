import "dotenv/config";
import "reflect-metadata";
import express from "express";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import cors from "cors";
import * as trpcExpress from "@trpc/server/adapters/express";
import { env, type ENVType } from "./env";
import { createContext } from "./trpc";
import { startJobs } from "./jobs";
import { appRouter } from "./router";
import { logger } from "./lib/logger";
import { useExpressServer } from "routing-controllers";
import { StripeController } from "./controllers/stripe";
import { createOpenApiExpressMiddleware } from "trpc-openapi";
import { renderTrpcPanel } from "trpc-panel";
import { isDev } from "./lib/utils";

async function bootstrap() {
	const app = express();

	app.use(helmet());
	app.use(cookieParser(env.COOKIE_SECRET));

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

	app.use("/api", createOpenApiExpressMiddleware({ router: appRouter, createContext }));

	app.use(
		"/trpc",
		trpcExpress.createExpressMiddleware({
			router: appRouter,
			createContext,
		})
	);

	if (isDev()) {
		// todo add openapi panel
		// ? might also want it always available, not just in dev

		// app.use("/dev/openapi", (req, res) => {
		// 	return res.send(
		// 		renderTrpcPanel(appRouter, { url: "http://localhost:3000/trpc", transformer: "superjson" })
		// 	);
		// });

		app.use("/dev/trpc-panel", (req, res) => {
			return res.send(
				renderTrpcPanel(appRouter, {
					url: "http://localhost:3000/trpc",
					transformer: "superjson",
				})
			);
		});
	}

	if (!env.JOBS_DISABLED) {
		logger.info("Starting jobs");
		startJobs();
	}

	app.listen(env.PORT || 3000, () => {
		logger.info(`Server started on port ${env.PORT || 3000}`);
	});
}

bootstrap();
