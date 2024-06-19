import "reflect-metadata";
import express from "express";
import compression from "compression";
import helmet from "helmet";
import path from "path";
import cookieParser from "cookie-parser";
import closeWithGrace from "close-with-grace";
import * as trpcExpress from "@trpc/server/adapters/express";
import { createRequestHandler } from "@remix-run/express";
import { useExpressServer } from "routing-controllers";
import { fileURLToPath } from "url";
import { renderTrpcPanel } from "trpc-panel";
import { getAppContext } from "./lib/app-context";
import { appRouter } from "./router";
import { env } from "./env";
import { createContext } from "./lib/trpc";
import { startJobs } from "./jobs";
import { logger } from "./lib/logger";
import { isDev } from "@shared/utils";
import type { ServerBuild } from "@remix-run/node";

// REST controllers
import { CommonController } from "./features/common/controllers/common";
import { BillingController } from "./features/billing/billing.controller";

const port = Number(process.env.PORT) || 3000;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const appBuildDir = path.resolve(__dirname, "../builds/app");

const viteDevServer =
	process.env.NODE_ENV === "production"
		? undefined
		: await import("vite").then(vite =>
				vite.createServer({
					server: { middlewareMode: true },
				})
			);

async function getBuild() {
	const build = viteDevServer
		? viteDevServer.ssrLoadModule("virtual:remix/server-build")
		: // @ts-ignore this should exist before running the server
			await import(path.resolve(appBuildDir, "server/index.js"));
	return build as unknown as ServerBuild;
}

function createApp() {
	const app = express();

	app.use(helmet());
	app.use(compression());
	app.use(cookieParser(env.COOKIE_SECRET));

	app.use(
		express.json({
			verify: (req, res, buf) => {
				// @ts-ignore
				req.rawBody = buf;
			},
		})
	);

	if (viteDevServer) {
		app.use(viteDevServer.middlewares);
	} else {
		// Remix fingerprints its assets so we can cache forever.
		app.use(
			"/assets",
			express.static("builds/app/client/assets", { immutable: true, maxAge: "1y" })
		);
		// Everything else (like favicon.ico) is cached for an hour. You may want to be
		// more aggressive with this caching.
		app.use(express.static("builds/app/client", { maxAge: "1h" }));
	}

	useExpressServer(app, {
		controllers: [CommonController, BillingController],
	});

	app.use(
		"/api/trpc",
		trpcExpress.createExpressMiddleware({
			router: appRouter,
			createContext,
		})
	);

	if (isDev()) {
		// todo add openapi panel
		// app.use("/dev/openapi", (req, res) => {
		// });

		app.use("/dev/trpc-panel", (req, res) => {
			return res.send(
				renderTrpcPanel(appRouter, {
					url: "http://localhost:3000/api/trpc",
					transformer: "superjson",
				})
			);
		});
	}

	app.all(
		"*",
		createRequestHandler({
			build: getBuild,
			getLoadContext: getAppContext,
		})
	);

	return app;
}

const app = createApp();

if (!env.JOBS_DISABLED) {
	logger.info("Starting jobs");
	startJobs();
}

const server = app.listen(port, () => {
	logger.info(`Server started on port ${port}`);
});

closeWithGrace(async () => {
	await new Promise((resolve, reject) => {
		server.close(e => (e ? reject(e) : resolve("ok")));
	});
});
