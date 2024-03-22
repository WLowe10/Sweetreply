import { updateMeInputSchema } from "@replyon/shared/schemas/auth";
import { authenticatedProcedure } from "@/trpc";

export const updateMeHandler = authenticatedProcedure.input(updateMeInputSchema).mutation(({ input, ctx }) => {
	return ctx.authService.updateUser(ctx.user.id, input);
});
