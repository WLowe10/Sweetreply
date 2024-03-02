import { publicProcedure } from "@/trpc"; // !should be private admin procedure
import { db, socialAccount } from "@/db";

export const createSocialAccountHandler = publicProcedure.mutation(() => {
    return db.insert(socialAccount).values({
        type: "reddit",
        createdAt: new Date(),
    });
});
