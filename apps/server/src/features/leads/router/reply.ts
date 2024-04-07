import { authenticatedProcedure } from "@/trpc";
import { z } from "zod";

export const replyToLeadInputSchema = z.object({
	id: z.string().uuid(),
	reply: z.string().max(512).optional(),
});

export const replyToLeadHandler = authenticatedProcedure.mutation(() => {});
