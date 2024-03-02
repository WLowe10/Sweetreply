import { publicProcedure } from "@/trpc"; // should be authenticatedProcedure

export const getMeHandler = publicProcedure.query(({ ctx }) => {
    return "sign-up success!";
});
