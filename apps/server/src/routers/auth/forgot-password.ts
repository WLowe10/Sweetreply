import { unauthenticatedProcedure } from "@/trpc";
import { forgotPasswordInputSchema } from "@replyon/shared/schemas/auth";

export const forgotPasswordHandler = unauthenticatedProcedure
	.input(forgotPasswordInputSchema)
	.mutation(async ({ ctx }) => {});
