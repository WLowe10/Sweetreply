import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";
import { user } from "./user";

export const team = pgTable("team", {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: text("slug").notNull().unique(),
    createdAt: timestamp("created_at", { withTimezone: true }),
    updatedAt: timestamp("updated_at", { withTimezone: true }),
});

export const teamMember = pgTable("team_member", {
    userId: uuid("user_id").references(() => user.id, { onDelete: "cascade" }),
    teamId: uuid("team_id").references(() => team.id, { onDelete: "cascade" }),
    joinedAt: timestamp("joined_at", { withTimezone: true }),
});

export type TeamType = typeof team.$inferSelect;
export type TeamMemberType = typeof teamMember.$inferSelect;
