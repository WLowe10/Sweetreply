import * as botsService from "@features/bots/service";
import { failedToDeleteReply, failedToUndoReply, leadHasNoReply, leadNotFound } from "../errors";
import { ReplyStatus } from "@sweetreply/shared/features/leads/constants";
import { canUndoReply } from "@sweetreply/shared/features/leads/utils";
import { subscribedProcedure } from "@features/billing/procedures";
import { singleLeadQuerySelect } from "../constants";
import { z } from "zod";

const undoReplyInputSchema = z.object({
	lead_id: z.string(),
});

export const undoReplyHandler = subscribedProcedure
	.input(undoReplyInputSchema)
	.mutation(async ({ input, ctx }) => {
		const lead = await ctx.leadsService.userOwnsLead({
			userID: ctx.user.id,
			leadID: input.lead_id,
		});

		if (!lead) {
			throw leadNotFound();
		}

		if (lead.reply_bot_id === null || lead.reply_remote_id === null) {
			throw leadHasNoReply();
		}

		if (!canUndoReply(lead)) {
			throw failedToUndoReply();
		}

		const botAccount = await ctx.prisma.bot.findUnique({
			where: {
				id: lead.reply_bot_id,
			},
		});

		if (!botAccount || !botAccount.active) {
			throw failedToUndoReply();
		}

		try {
			await botsService.executeBot(botAccount, async (bot) => {
				// @ts-ignore
				await bot.deleteReply(lead);
			});
		} catch (err) {
			throw failedToDeleteReply();
		}

		return await ctx.prisma.lead.update({
			where: {
				id: lead.id,
			},
			data: {
				replied_at: null,
				reply_bot_id: null,
				reply_remote_id: null,
				reply_scheduled_at: null,
				reply_remote_url: null,
				reply_status: ReplyStatus.DRAFT,
			},
			select: singleLeadQuerySelect,
		});
	});
