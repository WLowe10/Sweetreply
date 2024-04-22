import { env } from "@/env";

export function isDev(): boolean {
	return env.NODE_ENV !== "production";
}

export function buildAPIUrl(path: string, query?: Record<string, string>): string {
	const url = new URL(env.FRONTEND_URL + path);

	if (query) {
		url.search = new URLSearchParams(query).toString();
	}

	return url.toString();
}

type BuildFrontendUrlOptions = {
	query?: Record<string, string>;
	path: string;
};

export function buildFrontendUrl(options?: string | BuildFrontendUrlOptions): string {
	const url = new URL(
		options
			? env.FRONTEND_URL + (typeof options === "string" ? options : options.path)
			: env.FRONTEND_URL
	);

	if (typeof options === "object") {
		if (options.query) {
			url.search = new URLSearchParams(options.query).toString();
		}
	}

	return url.toString();
}
