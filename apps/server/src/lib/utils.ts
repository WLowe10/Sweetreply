import { env } from "@/env";

export function isDev(): boolean {
	return process.env.NODE_ENV !== "production";
}

export function buildFrontendUrl(path: string) {
	return env.FRONTEND_URL + path;
}
