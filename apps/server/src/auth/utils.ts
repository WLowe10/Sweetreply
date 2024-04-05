import { userModel } from "@replyon/prisma/zod";
import type { User } from "@replyon/prisma";

const serializedUserSchema = userModel.pick({
	id: true,
	email: true,
	verified_at: true,
	verification_requested_at: true,
	first_name: true,
	last_name: true,
	avatar_url: true,
	role: true,
});

export const serializeUser = (user: User) => serializedUserSchema.parse(user);
