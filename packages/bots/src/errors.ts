export type BotErrorCode =
	| "INVALID_CREDENTIALS"
	| "RATE_LIMITED"
	| "REPLY_LOCKED"
	| "AUTHENTICATION_FAILED"
	| "UNKNOWN"
	| "BANNED";

export const BotErrorMessage: Record<BotErrorCode, string> = {
	INVALID_CREDENTIALS: "Bot has invalid credentials",
	AUTHENTICATION_FAILED: "Failed to authenticate",
	RATE_LIMITED: "Bot has been ratelimited",
	REPLY_LOCKED: "Lead has been locked",
	UNKNOWN: "An unknown error occurred",
	BANNED: "Bot has been banned",
} as const;

export class BotError extends Error {
	public code: BotErrorCode;

	constructor(code: BotErrorCode, message?: string) {
		super(message ?? BotErrorMessage[code]);

		this.code = code;
	}
}
