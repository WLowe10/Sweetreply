import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";

export const user = pgTable("auth_user", {
    id: uuid("id").primaryKey().defaultRandom(),
    role: text("role", { enum: ["user", "admin"] })
        .default("user")
        .notNull(),
    name: text("name").unique().notNull(),
    email: text("email").notNull(),
    emailVerified: timestamp("email_verified", {
        withTimezone: true,
    }),
    passwordHash: text("password_hash").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
        .defaultNow()
        .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
        .defaultNow()
        .notNull(),
});

export type UserType = typeof user.$inferInsert;
