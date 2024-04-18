import { appConfig } from "@sweetreply/shared/config";

export const isBrowser = () => typeof window !== "undefined";

export const getEnv = (key?: string) => {
	const env: Record<string, any> = isBrowser() ? window.ENV : process.env;

	return key ? env[key] : env;
};

// export const getPublicEnv = (key?: keyof typeof window.ENV) => {
// 	const env = isBrowser() ? window.ENV : ({} as any);

// 	return key ? env[key] : env;
// };

export const buildPageTitle = (title: string) => `${title} | ${appConfig.name}`;

export const buildAPIUrl = (path: string) => getEnv("API_URL") + path;
