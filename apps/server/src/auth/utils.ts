import { userModel } from "@sweetreply/prisma/zod";
import type { User } from "@sweetreply/prisma";

const serializedUserSchema = userModel.pick({
	id: true,
	email: true,
	verified_at: true,
	verification_requested_at: true,
	first_name: true,
	last_name: true,
	role: true,
	plan: true,
	subscription_ends_at: true,
	reply_credits: true,
});

export const serializeUser = (user: User) => serializedUserSchema.parse(user);
