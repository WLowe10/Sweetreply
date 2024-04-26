import { authenticatedProcedure } from "@/trpc";
import { leadAlreadyReplied, leadNotFound } from "../errors";
import { projectNotFound } from "@/features/projects/errors";
import { replyQueue } from "@/features/lead-engine/queues/reply";
import { replyStatus } from "@sweetreply/shared/features/leads/constants";
import { canSendReply } from "@sweetreply/shared/features/leads/utils";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export const sendReplyInputSchema = z.object({
	lead_id: z.string(),
});

export const sendReplyHandler = authenticatedProcedure
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

		if (ctx.user.reply_credits === 0) {
			throw new TRPCError({
				code: "FORBIDDEN",
				message: "You are out of reply credits. Please upgrade your plan.",
			});
		}

		if (!canSendReply(lead)) {
			throw leadAlreadyReplied();
		}

		replyQueue.add({ lead_id: lead.id }, { jobId: lead.id });

		// set to pending (waiting for reply in the queue)
		return await ctx.prisma.lead.update({
			where: {
				id: lead.id,
			},
			data: {
				reply_status: replyStatus.SCHEDULED,
				reply_scheduled_at: new Date(),
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
