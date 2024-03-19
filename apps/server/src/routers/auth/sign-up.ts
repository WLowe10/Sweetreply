import { unauthenticatedProcedure } from "~/trpc";
import { env } from "~/env";
import { TRPCError } from "@trpc/server";

export const signUpHandler = unauthenticatedProcedure.mutation(({ ctx }) => {
	if (env.AUTH_REGISTRATION_DISABLED) {
		throw new TRPCError({
			code: "FORBIDDEN",
			message: "Registration is currenlty disabled.",
		});
	}

	// ctx.emailService.sendWelcomeEmail({
	// 	data: {
	// 		firstName: "John",
	// 	},
	// });

	// create user

	// and log
});
