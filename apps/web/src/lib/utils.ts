import { env } from "@/env";

export function buildAPIUrl(path: string) {
	return env.NEXT_PUBLIC_API_URL + path;
}
