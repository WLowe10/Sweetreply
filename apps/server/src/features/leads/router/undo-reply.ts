import { z } from "zod";
import { handleBotError } from "@features/bots/service";
import { failedToDeleteReply, failedToUndoReply, leadHasNoReply, leadNotFound } from "../errors";
import { sleep, sleepRange } from "@sweetreply/shared/lib/utils";
import { BotError, createBot } from "@sweetreply/bots";
import { ReplyStatus } from "@sweetreply/shared/features/leads/constants";
import { canUndoReply } from "@sweetreply/shared/features/leads/utils";
import { subscribedProcedure } from "@features/billing/procedures";

const undoReplyInputSchema = z.object({
	lead_id: z.string(),
});

export const undoReplyHandler = subscribedProcedure
	.input(undoReplyInputSchema)
	.mutation(async ({ input, ctx }) => {
		if (!ctx.user.plan) {
		}
		const lead = await ctx.prisma.lead.findUnique({
			where: {
				id: input.lead_id,
			},
		});

		if (!lead) {
			throw leadNotFound();
		}

		const userOwnsProject = await ctx.projectsService.userOwnsProject({
			userId: ctx.user.id,
			projectId: lead.project_id,
		});

		if (!userOwnsProject) {
			throw leadNotFound();
		}

		if (lead.reply_bot_id === null) {
			throw leadHasNoReply();
		}

		if (!canUndoReply(lead)) {
			throw leadHasNoReply();
		}

		const botAccount = await ctx.prisma.bot.findUnique({
			where: {
				id: lead.reply_bot_id,
			},
		});

		if (!botAccount || !botAccount.active) {
			throw failedToUndoReply();
		}

		const bot = createBot(botAccount);

		if (!bot) {
			throw failedToUndoReply();
		}

		try {
			await bot.login();

			await sleepRange(5000, 10000);

			await bot.deleteReply(lead);
		} catch (err) {
			if (err instanceof BotError) {
				await handleBotError(botAccount.id, err);
			}

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
				reply_status: ReplyStatus.DRAFT,
			},
			select: {
				id: true,
				platform: true,
				type: true,
				locked: true,
				remote_channel_id: true,
				username: true,
				content: true,
				title: true,
				created_at: true,
				date: true,
				name: true,
				project_id: true,
				remote_user_id: true,
				remote_id: true,
				remote_url: true,
				channel: true,
				reply_status: true,
				replied_at: true,
				reply_text: true,
				reply_remote_id: true,
				reply_scheduled_at: true,
				replies_generated: true,
				reply_remote_url: true,
				reply_bot: {
					select: {
						username: true,
					},
				},
			},
		});
	});
