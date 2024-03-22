import { unauthenticatedProcedure } from "@/trpc";
import { env } from "@/env";
import { TRPCError } from "@trpc/server";
import { signInInputSchema } from "@replyon/shared/schemas/auth";

export const signInHandler = unauthenticatedProcedure.input(signInInputSchema).mutation(({ ctx }) => {});
