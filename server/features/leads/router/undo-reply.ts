import { failedToUndoReply, leadHasNoReply, leadNotFound } from "../errors";
import { ReplyStatus } from "~/features/leads/constants";
import { canUndoReply } from "~/features/leads/utils";
import { subscribedProcedure } from "~/features/billing/procedures";
import { BotAction, singleLeadQuerySelect } from "../constants";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

const undoReplyInputSchema = z.object({
	lead_id: z.string(),
});

export const undoReplyHandler = subscribedProcedure
	.input(undoReplyInputSchema)
	.mutation(async ({ input, ctx }) => {
		const lead = await ctx.leadsService.userOwnsLead({
			userId: ctx.user.id,
			leadId: input.lead_id,
		});

		if (!lead) {
			throw leadNotFound();
		}

		if (lead.reply_status === ReplyStatus.REMOVING) {
			throw new TRPCError({
				code: "FORBIDDEN",
				message: "Reply is already being removed",
			});
		}

		if (
			lead.reply_status !== ReplyStatus.REPLIED ||
			lead.reply_bot_id === null ||
			lead.reply_remote_id === null
		) {
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

		ctx.leadsService.addBotActionJob(lead.id, BotAction.REMOVE_REPLY);

		return await ctx.prisma.lead.update({
			where: {
				id: lead.id,
			},
			data: {
				reply_status: ReplyStatus.REMOVING,
			},
			select: singleLeadQuerySelect,
		});
	});
