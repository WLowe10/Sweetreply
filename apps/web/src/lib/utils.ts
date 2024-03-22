import { env } from "@/env";
import { appConfig } from "@replyon/shared/lib/constants";

export function buildAPIUrl(path: string) {
	return env.NEXT_PUBLIC_API_URL + path;
}

export function buildTitle(pageName: string, appName: string = appConfig.name) {
	return `${pageName} | ${appConfig.name}`;
}
