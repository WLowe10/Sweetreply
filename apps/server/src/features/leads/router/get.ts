import { authenticatedProcedure } from "@features/auth/procedures";
import { z } from "zod";
import { leadNotFound } from "../errors";
import { singleLeadQuerySelect } from "../constants";

export const getLeadInputSchema = z.object({
	id: z.string().uuid(),
});

export const getLeadHandler = authenticatedProcedure
	.input(getLeadInputSchema)
	.query(async ({ input, ctx }) => {
		const lead = await ctx.leadsService.userOwnsLead({
			userID: ctx.user.id,
			leadID: input.id,
		});

		if (!lead) {
			throw leadNotFound();
		}

		return ctx.prisma.lead.findFirst({
			where: {
				id: input.id,
			},
			select: singleLeadQuerySelect,
		});
	});
