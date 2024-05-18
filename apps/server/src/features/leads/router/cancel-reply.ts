import { authenticatedProcedure } from "@features/auth/procedures";
import { botActionQueue } from "@features/leads/queues/bot-action";
import { failedToCancelReply, leadNotFound } from "../errors";
import { ReplyStatus } from "@sweetreply/shared/features/leads/constants";
import { canCancelReply } from "@sweetreply/shared/features/leads/utils";
import { z } from "zod";
import { singleLeadQuerySelect } from "../constants";

const cancelReplyInputSchema = z.object({
	lead_id: z.string(),
});

export const cancelReplyHandler = authenticatedProcedure
	.input(cancelReplyInputSchema)
	.mutation(async ({ input, ctx }) => {
		const lead = await ctx.leadsService.userOwnsLead({
			userID: ctx.user.id,
			leadID: input.lead_id,
		});

		if (!lead) {
			throw leadNotFound();
		}

		if (!canCancelReply(lead)) {
			throw failedToCancelReply();
		}

		const job = await botActionQueue.getJob(input.lead_id);

		if (job) {
			const isActive = await job.isActive();

			if (isActive) {
				throw failedToCancelReply();
			}
		}

		if (job) {
			try {
				await job.remove();
			} catch {
				throw failedToCancelReply();
			}
		}

		return ctx.prisma.lead.update({
			where: {
				id: input.lead_id,
			},
			data: {
				replied_at: null,
				reply_scheduled_at: null,
				reply_status: ReplyStatus.DRAFT,
			},
			select: singleLeadQuerySelect,
		});
	});
