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

export const editReplyHandler = subscribedProcedure
	.input(editReplyInputSchema)
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
				reply_remote_url: true,
				reply_scheduled_at: true,
				replies_generated: true,
				reply_bot: {
					select: {
						username: true,
					},
				},
			},
		});
	});
