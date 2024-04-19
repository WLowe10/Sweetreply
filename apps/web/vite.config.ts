import { vitePlugin as remix } from "@remix-run/dev";
import { installGlobals } from "@remix-run/node";
import { defineConfig } from "vite";
import { flatRoutes } from "remix-flat-routes";
import tsconfigPaths from "vite-tsconfig-paths";
import mdx from "@mdx-js/rollup";
import remarkFrontmatter from "remark-frontmatter";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";
import remarkToc from "remark-toc";

installGlobals();

export default defineConfig({
	server: {
		port: 3001,
	},
	plugins: [
		tsconfigPaths(),
		mdx({
			remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter, remarkToc],
		}),
		remix({
			appDirectory: "./src",
			routes: (defineRoutes) => {
				return flatRoutes("routes", defineRoutes, {
					appDir: "./src",
				});
			},
		}),
	],
});
