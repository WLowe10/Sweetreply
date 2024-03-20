export const authConstants = {
	SESSION_ID_TOKEN: "sid",
	SESSION_EXPIRATION: 1000 * 60 * 60 * 24 * 14, // 14 days
	PASSWORD_RESET_EXPIRATION: 1000 * 60 * 60, // 1 hour
	ACCOUNT_VERIFICATION_EXPIRATION: 1000 * 60 * 60, // 1 hour
	EMAIL_COOLDOWN: 1000 * 60 * 5, // 5 minutes
} as const;
