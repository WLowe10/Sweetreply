import { unauthenticatedProcedure } from "@auth/procedures";
import { env } from "@env";
import { TRPCError } from "@trpc/server";
import { signUpInputSchema } from "@sweetreply/shared/features/auth/schemas";
import { serializeUser } from "../utils";

export const signUpHandler = unauthenticatedProcedure
	.input(signUpInputSchema)
	.mutation(async ({ ctx, input }) => {
		if (env.AUTH_REGISTRATION_DISABLED) {
			throw new TRPCError({
				code: "FORBIDDEN",
				message: "Registration is currently disabled.",
			});
		}

		const user = await ctx.authService.registerUser(input);
		const session = await ctx.authService.createSessionForUser(user.id);

		ctx.authService.sendSessionCookie(ctx.res, session);

		return serializeUser(user);
	});
