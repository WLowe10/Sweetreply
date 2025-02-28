import { env } from "@env";
import { AxiosProxyConfig } from "axios";

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

export const scrapingProxyIsDefined = (): boolean =>
	!!env.SCRAPING_PROXY_HOST &&
	!!env.SCRAPING_PROXY_PORT &&
	!!env.SCRAPING_PROXY_USER &&
	!!env.SCRAPING_PROXY_PASS;

export const getAxiosScrapingProxy = (): AxiosProxyConfig | undefined =>
	scrapingProxyIsDefined()
		? {
				protocol: "http",
				host: env.SCRAPING_PROXY_HOST!,
				port: env.SCRAPING_PROXY_PORT!,
				auth: {
					username: env.SCRAPING_PROXY_USER!,
					password: env.SCRAPING_PROXY_PASS!,
				},
			}
		: undefined;

export const testKeywords = (
	target: string,
	{ keywords, negativeKeywords }: { keywords: string[]; negativeKeywords: string[] }
) => {
	let isMatch = false;

	for (const keyword of keywords) {
		if (target.includes(keyword)) {
			isMatch = true;
			break;
		}
	}

	for (const negativeKeyword of negativeKeywords) {
		if (target.includes(negativeKeyword)) {
			isMatch = false;
			break;
		}
	}

	return isMatch;
};
