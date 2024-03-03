import { publicProcedure } from "@/trpc";
import { db, user } from "@/db";
import { eq } from "drizzle-orm";
import { signUpInputSchema } from "@replyon/shared/schemas/auth";

export const signUpHandler = publicProcedure
    .input(signUpInputSchema)
    .mutation(async ({ input, ctx }) => {
        const existingUser = await db
            .select({
                id: user.id,
            })
            .from(user)
            .where(eq(user.email, input.email.toLowerCase()));

        const newUser = await db
            .insert(user)
            .values({
                name: "",
                email: "",
                passwordHash: "",
            })
            .returning();

        newUser;
    });
