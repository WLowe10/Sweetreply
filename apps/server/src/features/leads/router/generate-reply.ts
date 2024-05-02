import { z } from "zod";
import { leadNotFound } from "../errors";
import { replyCompletion } from "@features/lead-engine/utils/completions/reply-completion";
import { ReplyStatus } from "@sweetreply/shared/features/leads/constants";
import { TRPCError } from "@trpc/server";
import { canGenerateReply } from "@sweetreply/shared/features/leads/utils";
import { subscribedProcedure } from "@features/billing/procedures";
import { singleLeadQuerySelect } from "../constants";

const generateReplyInputSchema = z.object({
	lead_id: z.string(),
});

export const generateReplyHandler = subscribedProcedure
	.input(generateReplyInputSchema)
	.mutation(async ({ input, ctx }) => {
		const lead = await ctx.leadsService.userOwnsLead({
			userID: ctx.user.id,
			leadID: input.lead_id,
		});

		if (!lead) {
			throw leadNotFound();
		}

		if (!canGenerateReply(lead)) {
			throw new TRPCError({
				code: "FORBIDDEN",
				message: "Cannot generate reply",
			});
		}

		if (!lead.project.description) {
			throw new TRPCError({
				code: "BAD_REQUEST",
				message: "Project description is required to generate a reply",
			});
		}

		const generatedReply = await replyCompletion({
			lead,
			project: lead.project,
		});

		return await ctx.prisma.lead.update({
			where: {
				id: lead.id,
			},
			data: {
				reply_status: lead.reply_status === null ? ReplyStatus.DRAFT : undefined,
				reply_text: generatedReply,
				replies_generated: {
					increment: 1,
				},
			},
			select: singleLeadQuerySelect,
		});
	});
