import { authenticatedProcedure } from "@/trpc";
import { replyQueue } from "@/features/lead-engine/queues/reply";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { leadNotFound } from "../errors";
import { projectNotFound } from "@/features/projects/errors";

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

		if (lead.reply_status !== "scheduled") {
			throw new TRPCError({
				code: "FORBIDDEN",
				message: "This reply is not scheduled",
			});
		}

		const job = await replyQueue.getJob(input.lead_id);

		if (!job) {
			throw new TRPCError({
				code: "INTERNAL_SERVER_ERROR",
				message: "Could not cancel reply",
			});
		}

		// todo research job states
		const isDelayed = await job.isDelayed();

		if (!isDelayed) {
			throw new TRPCError({
				code: "INTERNAL_SERVER_ERROR",
				message: "Could not cancel reply",
			});
		}

		await job.remove();

		return ctx.prisma.lead.update({
			where: {
				id: input.lead_id,
			},
			data: {
				replied_at: null,
				reply_status: null,
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
				reply_bot: {
					select: {
						username: true,
					},
				},
			},
		});
	});
