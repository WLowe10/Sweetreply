import { protectedProcedure } from "@/trpc"; // should be authenticatedProcedure

export const getMeHandler = protectedProcedure.query(({ ctx }) => {
    return ctx.user;
});
