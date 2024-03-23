import { z } from "zod";
import { userModel } from "@replyon/prisma/zod";

export const baseUserSchema = userModel.extend({
	email: z.string().email().max(100),
	password: z.string().min(8),
	first_name: z.string().max(32),
	last_name: z.string().max(32),
	avatar_url: z.string().url().optional(),
});

export const signUpInputSchema = baseUserSchema.pick({
	email: true,
	password: true,
	first_name: true,
	last_name: true,
});

export const signInInputSchema = signUpInputSchema.pick({
	email: true,
	password: true,
});

export const forgotPasswordInputSchema = signInInputSchema.pick({
	email: true,
});

export const updateMeInputSchema = baseUserSchema
	.pick({
		first_name: true,
		last_name: true,
		avatar_url: true,
	})
	.partial();

export type SignUpType = z.infer<typeof signUpInputSchema>;
export type SignInType = z.infer<typeof signInInputSchema>;
export type UpdateMeType = z.infer<typeof updateMeInputSchema>;
