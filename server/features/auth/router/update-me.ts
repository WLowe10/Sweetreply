import { updateMeInputSchema } from "~/features/auth/schemas";
import { authenticatedProcedure } from "~/features/auth/procedures";
import type { User } from "@prisma/client";

export const updateMeHandler = authenticatedProcedure
	.input(updateMeInputSchema)
	.mutation(({ input, ctx }) => {
		return ctx.authService.updateUser(ctx.user.id, input) as Promise<User>;
	});
