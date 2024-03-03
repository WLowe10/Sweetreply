import { z } from "zod";

export const signUpInputSchema = z.object({
    name: z.string().max(64),
    email: z.string().email().max(100),
    password: z.string().min(8),
});
