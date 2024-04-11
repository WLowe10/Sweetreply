import { vitePlugin as remix } from "@remix-run/dev";
import { installGlobals } from "@remix-run/node";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { flatRoutes } from "remix-flat-routes";

installGlobals();

export default defineConfig({
	server: {
		port: 3001,
	},
	plugins: [
		remix({
			appDirectory: "./src/app",
			routes: (defineRoutes) => {
				return flatRoutes("routes", defineRoutes, {
					appDir: "./src/app",
				});
			},
		}),
		tsconfigPaths(),
	],
});
