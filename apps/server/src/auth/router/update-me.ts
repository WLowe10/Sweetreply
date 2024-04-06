import { updateMeInputSchema } from "@sweetreply/shared/schemas/auth";
import { authenticatedProcedure } from "@/trpc";
import type { User } from "@sweetreply/prisma";

export const updateMeHandler = authenticatedProcedure
	.input(updateMeInputSchema)
	.mutation(({ input, ctx }) => {
		return ctx.authService.updateUser(ctx.user.id, input) as Promise<User>;
	});
