import { prisma } from "@/lib/db";
import argon2 from "argon2";

/**
 * This will create an initial admin user with your email. Make sure to change the password after you log in.
 */

const defaultAdminEmail = "wesley.lowe@yahoo.com";

export async function runSeed() {
	// await prisma.user.create({
	// 	data: {
	// 		email: defaultAdminEmail,
	// 		password_hash: await argon2.hash("abc123"),
	// 		first_name: "Admin",
	// 		last_name: "Admin",
	// 		role: "admin"
	// 		verified_at: new Date(),
	// 	},
	// });
}
