import { pgTable, uuid, timestamp } from "drizzle-orm/pg-core";
import { user } from "./user";

export const session = pgTable("session", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
        .references(() => user.id, { onDelete: "cascade" })
        .notNull(),
    expiresAt: timestamp("created_at", { withTimezone: true }).notNull(),
});

export type SessionType = typeof session.$inferSelect;
