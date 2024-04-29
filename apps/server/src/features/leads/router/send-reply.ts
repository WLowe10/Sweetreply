import { sendReplyInputSchema } from "@sweetreply/shared/features/leads/schemas";
import { failedToSendReply, leadNotFound, replyAlreadySent } from "../errors";
import { ReplyStatus } from "@sweetreply/shared/features/leads/constants";
import { canSendReply } from "@sweetreply/shared/features/leads/utils";
import { TRPCError } from "@trpc/server";
import { addReplyJob } from "@features/lead-engine/utils/add-reply-job";
import { subscribedProcedure } from "@features/billing/procedures";
import { outOfReplyCredits } from "@features/billing/errors";

export const sendReplyHandler = subscribedProcedure
	.input(sendReplyInputSchema)
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

		if (lead.reply_status === ReplyStatus.REPLIED) {
			throw replyAlreadySent();
		}

		if (ctx.user.reply_credits === 0) {
			throw outOfReplyCredits();
		}

		if (!canSendReply(lead)) {
			throw failedToSendReply();
		}

		addReplyJob(lead.id, {
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
