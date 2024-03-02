import { publicProcedure } from "@/trpc";

export const signUpHandler = publicProcedure.mutation(({ ctx }) => {
    return "sign-up success!";
});
