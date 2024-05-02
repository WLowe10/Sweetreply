import { editReplyInputSchema } from "@sweetreply/shared/features/leads/schemas";
import { failedToEditReply, leadNotFound } from "../errors";
import { TRPCError } from "@trpc/server";
import {
	ReplyCharacterLimit,
	ReplyStatus,
	type LeadPlatformType,
} from "@sweetreply/shared/features/leads/constants";
import { canEditReply } from "@sweetreply/shared/features/leads/utils";
import { subscribedProcedure } from "@features/billing/procedures";
import { singleLeadQuerySelect } from "../constants";

export const editReplyHandler = subscribedProcedure
	.input(editReplyInputSchema)
	.mutation(async ({ input, ctx }) => {
		const lead = await ctx.leadsService.userOwnsLead({
			userID: ctx.user.id,
			leadID: input.lead_id,
		});

		if (!lead) {
			throw leadNotFound();
		}

		if (!canEditReply(lead)) {
			throw failedToEditReply();
		}

		const replyCharacterLimit = ReplyCharacterLimit[lead.platform as LeadPlatformType];

		if (!replyCharacterLimit) {
			throw failedToEditReply();
		}

		if (input.data.reply_text.length > replyCharacterLimit) {
			throw new TRPCError({
				code: "BAD_REQUEST",
				message: `Reply can not be longer than ${replyCharacterLimit} characters`,
			});
		}

		return await ctx.prisma.lead.update({
			where: {
				id: lead.id,
			},
			data: {
				reply_status: lead.reply_status === null ? ReplyStatus.DRAFT : undefined,
				reply_text: input.data.reply_text,
			},
			select: singleLeadQuerySelect,
		});
	});
