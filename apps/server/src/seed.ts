import { prisma } from "@/lib/db";
import { UserRole } from "@replyon/prisma";
import argon2 from "argon2";

/**
 * This will create an initial admin user with your email. Make sure to change the password after you log in.
 */

export async function runSeed() {
	await prisma.user.create({
		data: {
			email: "",
			password_hash: await argon2.hash("abc123"),
			first_name: "Admin",
			last_name: "Admin",
			role: UserRole.admin,
		},
	});
}
