import { env } from "@/env";
import { appConfig } from "@sweetreply/shared/lib/constants";

export function buildAPIUrl(path: string) {
	// return env.NEXT_PUBLIC_API_URL + path;
	// !should use env var, disabled during dev because of error
	return "http://localhost:3000" + path;
}

export function buildTitle(pageName: string, appName: string = appConfig.name) {
	return `${pageName} | ${appConfig.name}`;
}
