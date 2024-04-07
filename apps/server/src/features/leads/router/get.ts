import { authenticatedProcedure } from "@/trpc";
import { z } from "zod";

export const getLeadInputSchema = z.object({
	id: z.string().uuid(),
});

export const getLeadHandler = authenticatedProcedure
	.input(getLeadInputSchema)
	.query(({ input, ctx }) => {
		// check to make sure user can read lead

		return ctx.prisma.lead.findFirst({
			where: {
				id: input.id,
			},
		});
	});
