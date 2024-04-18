import { z } from "zod";

const envBool = z
	.string()
	.toLowerCase()
	.transform((val) => JSON.parse(val))
	.pipe(z.boolean());

export const envSchema = z.object({
	PORT: z.coerce.number().optional(),
	NODE_ENV: z.enum(["development", "production"]).default("production"),
	FRONTEND_URL: z.string(),
	DB_URL: z.string(),
	COOKIE_SECRET: z.string(),
	EMAIL_VERIFICATION_SECRET: z.string(),
	JOBS_DISABLED: envBool.optional(),
	AUTH_REGISTRATION_DISABLED: envBool.optional(),

	// --- ADD CUSTOM ENV VARIABLES BELOW ---

	NOTIFICATION_WEBHOOK_URL: z.string(),
	REDIS_URL: z.string(),
	AWS_REGION: z.string(),
	AWS_ACCESS_KEY: z.string(),
	AWS_SECRET_KEY: z.string(),
	AWS_SES_SENDER: z.string(),
	STRIPE_SECRET_KEY: z.string(),
	STRIPE_WEBHOOK_SECRET: z.string(),
	OPEN_AI_KEY: z.string(),
});

export const env = envSchema.parse(process.env);
