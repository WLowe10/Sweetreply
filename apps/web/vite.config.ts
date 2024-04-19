import { vitePlugin as remix } from "@remix-run/dev";
import { installGlobals } from "@remix-run/node";
import { defineConfig } from "vite";
import { flatRoutes } from "remix-flat-routes";
import tsconfigPaths from "vite-tsconfig-paths";
import mdx from "@mdx-js/rollup";
import rehypeSlug from "rehype-slug";
import remarkFrontmatter from "remark-frontmatter";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";

installGlobals();

export default defineConfig({
	server: {
		port: 3001,
	},
	plugins: [
		tsconfigPaths(),
		mdx({
			rehypePlugins: [rehypeSlug],
			remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter],
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
