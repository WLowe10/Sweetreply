import { authenticatedProcedure } from "@features/auth/procedures";
import { z } from "zod";
import { leadNotFound } from "../errors";
import { canDeleteLead } from "@sweetreply/shared/features/leads/utils";
import { TRPCError } from "@trpc/server";

const deleteLeadInputSchema = z.object({
	lead_id: z.string(),
});

export const deleteLeadHandler = authenticatedProcedure
	.input(deleteLeadInputSchema)
	.mutation(async ({ input, ctx }) => {
		const lead = await ctx.leadsService.userOwnsLead({
			userID: ctx.user.id,
			leadID: input.lead_id,
		});

		if (!lead) {
			throw leadNotFound();
		}

		if (!canDeleteLead(lead)) {
			throw new TRPCError({
				code: "FORBIDDEN",
				message: "Failed to delete lead",
			});
		}

		await ctx.prisma.lead.delete({
			where: {
				id: lead.id,
			},
		});
	});
