import { authenticatedProcedure } from "@/trpc";
import { z } from "zod";
import { failedToDeleteReply, failedToUndoReply, leadHasNoReply, leadNotFound } from "../errors";
import { sleep } from "@sweetreply/shared/lib/utils";
import { createBotHandler } from "@/features/bots/utils/create-bot-handler";
import { replyStatus } from "@sweetreply/shared/features/leads/constants";
import { canUndoReply } from "@sweetreply/shared/features/leads/utils";

const undoReplyInputSchema = z.object({
	lead_id: z.string(),
});

export const undoReplyHandler = authenticatedProcedure
	.input(undoReplyInputSchema)
	.mutation(async ({ input, ctx }) => {
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

		if (!botAccount) {
			throw failedToUndoReply();
		}

		const handler = createBotHandler({ bot: botAccount, lead });

		if (!handler) {
			throw failedToUndoReply();
		}

		try {
			await handler.login();

			await sleep(2500);

			await handler.deleteReply();
		} catch {
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
				reply_status: replyStatus.DRAFT,
			},
			select: {
				id: true,
				platform: true,
				type: true,
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
