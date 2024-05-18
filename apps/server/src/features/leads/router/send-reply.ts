import { sendReplyInputSchema } from "@sweetreply/shared/features/leads/schemas";
import { failedToSendReply, leadNotFound, replyAlreadySent } from "../errors";
import { ReplyStatus } from "@sweetreply/shared/features/leads/constants";
import { canSendReply } from "@sweetreply/shared/features/leads/utils";
import { subscribedProcedure } from "@features/billing/procedures";
import { outOfReplyCredits } from "@features/billing/errors";
import { singleLeadQuerySelect } from "../constants";
import { TRPCError } from "@trpc/server";

export const sendReplyHandler = subscribedProcedure
	.input(sendReplyInputSchema)
	.mutation(async ({ input, ctx }) => {
		const lead = await ctx.leadsService.userOwnsLead({
			userID: ctx.user.id,
			leadID: input.lead_id,
		});

		if (!lead) {
			throw leadNotFound();
		}

		if (lead.reply_status === ReplyStatus.REPLIED) {
			throw replyAlreadySent();
		}

		if (ctx.user.reply_credits <= 0) {
			throw outOfReplyCredits();
		}

		if (!canSendReply(lead)) {
			throw failedToSendReply();
		}

		const outstandingReplies = await ctx.leadsService.countOutstandingRepliesForUser(
			ctx.user.id
		);

		if (outstandingReplies >= ctx.user.reply_credits) {
			throw new TRPCError({
				code: "FORBIDDEN",
				message:
					"You have reached your reply limit. Please upgrade your plan or cancel some scheduled replies.",
			});
		}

		ctx.leadsService.addReplyJob(lead.id, {
			date: input.data?.date ?? undefined,
		});

		return await ctx.prisma.lead.update({
			where: {
				id: lead.id,
			},
			data: {
				reply_status: ReplyStatus.SCHEDULED,
				reply_scheduled_at: input.data?.date || new Date(),
			},
			select: singleLeadQuerySelect,
		});
	});
