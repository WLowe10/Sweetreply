const { z } = require("zod");

const envSchema = z.object({
	NEXT_PUBLIC_API_URL: z.string(),
});

module.exports.env = envSchema.parse({
	NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
});
