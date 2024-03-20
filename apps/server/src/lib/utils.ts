import { env } from "@/env";

export function isDev(): boolean {
	return process.env.NODE_ENV !== "production";
}

export function buildAPIUrl(path: string, query?: Record<string, string>): string {
	const url = new URL(env.FRONTEND_URL + path);

	if (query) {
		url.search = new URLSearchParams(query).toString();
	}

	return url.toString();
}

export function buildFrontendUrl(path: string, query?: Record<string, string>): string {
	const url = new URL(env.FRONTEND_URL + path);

	if (query) {
		url.search = new URLSearchParams(query).toString();
	}

	return url.toString();
}
