import { unauthenticatedProcedure } from "~/trpc";

export const signInHandler = unauthenticatedProcedure.mutation(
    ({ input, ctx }) => {}
);
