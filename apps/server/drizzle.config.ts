import type { Config } from "drizzle-kit";

export default {
    schema: "./src/db/schemas/*",
    out: "./src/db/migrations",

    driver: "pg",
    dbCredentials: {
        host: process.env.DB_HOST!,
        port: process.env.DB_PORT! as unknown as number,
        database: process.env.DB_NAME!,
        user: process.env.DB_USER!,
        password: process.env.DB_PASSWORD!,
    },
} satisfies Config;
