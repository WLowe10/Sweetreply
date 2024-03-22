import { unauthenticatedProcedure } from "@/trpc";
import { env } from "@/env";
import { TRPCError } from "@trpc/server";
import { signUpInputSchema } from "@replyon/shared/schemas/auth";

export const signUpHandler = unauthenticatedProcedure.input(signUpInputSchema).mutation(({ ctx }) => {
	if (env.AUTH_REGISTRATION_DISABLED) {
		throw new TRPCError({
			code: "FORBIDDEN",
			message: "Registration is currently disabled.",
		});
	}

	throw new TRPCError({
		code: "FORBIDDEN",
		message: "Registration is currently disabled.",
	});

	// ctx.emailService.sendWelcomeEmail({
	// 	data: {
	// 		firstName: "John",
	// 	},
	// });

	// create user

	// and log
});
