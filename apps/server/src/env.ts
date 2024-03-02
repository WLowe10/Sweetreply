import { z } from "zod";

export const envSchema = z.object({
    PORT: z.coerce.number().optional(),
    DB_HOST: z.string(),
    DB_NAME: z.string(),
    DB_PORT: z.coerce.number(),
    DB_USER: z.string(),
    DB_PASSWORD: z.string(),
});

export const env = envSchema.parse(process.env);
