import { authenticatedProcedure } from "@/trpc";
import { replyQueue } from "@/features/lead-engine/queues/reply";
import { z } from "zod";
import { failedToCancelReply, leadNotFound } from "../errors";
import { replyStatus } from "@sweetreply/shared/features/leads/constants";
import { canCancelReply } from "@sweetreply/shared/features/leads/utils";

const cancelReplyInputSchema = z.object({
	lead_id: z.string(),
});

export const cancelReplyHandler = authenticatedProcedure
	.input(cancelReplyInputSchema)
	.mutation(async ({ input, ctx }) => {
		// consider checking if the time is past replied_at

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

		if (!canCancelReply(lead)) {
			throw failedToCancelReply();
		}

		const job = await replyQueue.getJob(input.lead_id);

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
				reply_bot: {
					select: {
						username: true,
					},
				},
			},
		});
	});
