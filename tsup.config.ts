import { defineConfig } from "tsup";

// tsup is used to build the server

export default defineConfig({
	entry: ["./server/main.ts"],
	outDir: "./builds/server",
	external: ["vite"],
	format: "esm",
	splitting: false,
	clean: true,
});
