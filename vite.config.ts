import { defineConfig } from "vite";
import { vitePlugin as remix } from "@remix-run/dev";
import { flatRoutes } from "remix-flat-routes";
import mdx from "@mdx-js/rollup";
import rehypeSlug from "rehype-slug";
import remarkFrontmatter from "remark-frontmatter";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
	plugins: [
		tsconfigPaths(),
		mdx({
			rehypePlugins: [rehypeSlug],
			remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter],
		}),
		remix({
			buildDirectory: "./builds/app",
			future: {
				v3_fetcherPersist: true,
				v3_relativeSplatPath: true,
				v3_throwAbortReason: true,
			},
			ignoredRouteFiles: ["**/*"],
			routes(defineRoutes) {
				return flatRoutes("routes", defineRoutes);
			},
		}),
	],
});
