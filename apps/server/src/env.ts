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

	// --- ADD CUSTOM ENV VARIABLES BELOW ---

	REDIS_URL: z.string(),
	AWS_REGION: z.string(),
	AWS_ACCESS_KEY: z.string(),
	AWS_SECRET_KEY: z.string(),
	AWS_SES_SENDER: z.string(),
	AWS_S3_BUCKET: z.string(),
	STRIPE_SECRET_KEY: z.string(),
	JOBS_DISABLED: envBool.optional(),
	AUTH_REGISTRATION_DISABLED: envBool.optional(),

	REDDIT_CLIENT_ID: z.string(),
	REDDIT_CLIENT_SECRET: z.string(),
	REDDIT_USERNAME: z.string(),
	REDDIT_PASSWORD: z.string(),
});

export type ENVType = z.infer<typeof envSchema>;

// makes process.env typesafe.
// it is still recommended to import { env } from here and use it instead of process.env.
declare global {
	namespace NodeJS {
		interface ProcessEnv extends ENVType {}
	}
}

export const env = envSchema.parse(process.env);
