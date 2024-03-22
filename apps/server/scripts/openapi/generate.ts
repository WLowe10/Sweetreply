import "dotenv/config";
import fs from "fs";
import path from "path";
import { generateOpenApiDocument } from "trpc-openapi";
import { appRouter } from "../../src/routers";

const outDir = path.resolve(process.cwd(), "out", "openapi");

if (!fs.existsSync(outDir)) {
	fs.mkdirSync(outDir, { recursive: true });
}

export const openAPIDocument = generateOpenApiDocument(appRouter, {
	title: "Example CRUD API",
	description: "OpenAPI compliant REST API built using tRPC with Express",
	version: "1.0.0",
	baseUrl: "http://localhost:3000/api",
	docsUrl: "https://github.com/jlalmes/trpc-openapi",
	tags: ["auth", "users", "posts"],
});

const outPath = path.resolve(outDir, "openapi.json");

fs.writeFileSync(outPath, JSON.stringify(openAPIDocument, null, 2));
console.log(`OpenAPI schema document generated at ${outPath}`);
