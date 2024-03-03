import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { env } from "@/env";

// schemas
import * as schemas from "./schemas";
export * from "./schemas";

const pool = new Pool({
    host: env.DB_HOST,
    port: env.DB_PORT,
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    database: env.DB_NAME,
});

// export const db = drizzle(pool, {
//     schema: schemas,
// });

export const db = drizzle(pool);
