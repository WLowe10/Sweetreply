export const BotStatus = {
	UNRESTRICTED: "unrestricted",
	RESTRICTED: "restricted",
	BANNED: "banned",
	INVALID_CREDENTIALS: "invalid_credentials",
} as const;

export const UserAgents = {
	chrome: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
} as const;
