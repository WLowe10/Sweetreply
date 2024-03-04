import { protectedProcedure } from "~/trpc";

export const signOutHandler = protectedProcedure.mutation(({ ctx }) => {
    return "sign-out success!";
});
