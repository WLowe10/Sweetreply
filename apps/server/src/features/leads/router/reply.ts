import { authenticatedProcedure } from "@/trpc";
import { leadAlreadyReplied, leadNotFound } from "../errors";
import { projectNotFound } from "@/features/projects/errors";
import { replyQueue } from "@/features/lead-engine/queues/reply";
import { replyStatus } from "@sweetreply/shared/features/leads/constants";
import { canReply } from "@sweetreply/shared/features/leads/utils";
import { z } from "zod";

export const replyToLeadInputSchema = z.object({
	lead_id: z.string(),
});

export const replyToLeadHandler = authenticatedProcedure
	.input(replyToLeadInputSchema)
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
			throw projectNotFound();
		}

		const leadCanReply = canReply(lead);

		if (!leadCanReply) {
			throw leadAlreadyReplied();
		}

		replyQueue.add({ lead_id: lead.id });

		// set to pending (waiting for reply in the queue)
		return await ctx.prisma.lead.update({
			where: {
				id: lead.id,
			},
			data: {
				reply_status: "pending",
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
				remote_reply_id: true,
				reply_bot: {
					select: {
						username: true,
					},
				},
			},
		});
	});
