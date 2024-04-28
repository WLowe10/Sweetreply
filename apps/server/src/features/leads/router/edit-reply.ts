import { authenticatedProcedure } from "@auth/procedures";
import { editReplyInputSchema } from "@sweetreply/shared/features/leads/schemas";
import { leadNotFound } from "../errors";
import { projectNotFound } from "@features/projects/errors";
import { TRPCError } from "@trpc/server";
import { replyStatus } from "@sweetreply/shared/features/leads/constants";
import { canEditReply } from "@sweetreply/shared/features/leads/utils";

export const editReplyHandler = authenticatedProcedure
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
			throw new TRPCError({
				code: "BAD_REQUEST",
				message: "You can't update a reply that has already been sent",
			});
		}

		return await ctx.prisma.lead.update({
			where: {
				id: lead.id,
			},
			data: {
				reply_status: lead.reply_status === null ? replyStatus.DRAFT : undefined,
				reply_text: input.data.reply_text,
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
