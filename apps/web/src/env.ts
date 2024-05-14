import { z } from "zod";

const envSchema = z.object({
	API_URL: z.string(),
	GA_TRACKING_ID: z.string().optional(),
});

export const env = envSchema.parse(process.env);
