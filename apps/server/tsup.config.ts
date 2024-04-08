// ! this tsup config is not being used at this time, left for reference

import { defineConfig } from "tsup";

export default defineConfig({
	entry: ["./src/main.ts"],
	noExternal: ["@sweetreply"], // Bundle any package starting with `@sweetreply` and its dependencies
	platform: "node",
	outDir: "./dist",
	splitting: false,
	bundle: true,
	clean: true,
	cjsInterop: true,
	minify: true,
	sourcemap: true,
});
