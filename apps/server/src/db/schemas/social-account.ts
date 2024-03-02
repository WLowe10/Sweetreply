import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";

export const socialAccount = pgTable("social_account", {
    id: uuid("id").primaryKey().defaultRandom(),
    type: text("type", { enum: ["reddit"] }).notNull(),
    lastUsedAt: timestamp("last_used_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
        .defaultNow()
        .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }),
});
