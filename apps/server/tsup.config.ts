import { defineConfig } from "tsup";

export default defineConfig({
	entry: ["./src/main.ts"],
	noExternal: ["@sweetreply"], // Bundle any package starting with `@sweetreply` and its dependencies
	platform: "node",
	splitting: false,
	bundle: true,
	outDir: "./dist",
	clean: true,
	loader: { ".json": "copy" },
	cjsInterop: true,
	minify: true,
	sourcemap: true,
});
