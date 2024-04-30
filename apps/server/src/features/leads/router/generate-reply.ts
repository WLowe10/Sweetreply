import { authenticatedProcedure } from "@features/auth/procedures";
import { z } from "zod";
import { failedToGenerateReply, leadNotFound } from "../errors";
import { replyCompletion } from "@features/lead-engine/utils/completions/reply-completion";
import { ReplyStatus } from "@sweetreply/shared/features/leads/constants";
import { TRPCError } from "@trpc/server";
import { canGenerateReply } from "@sweetreply/shared/features/leads/utils";
import { subscribedProcedure } from "@features/billing/procedures";

const generateReplyInputSchema = z.object({
	lead_id: z.string(),
});

export const generateReplyHandler = subscribedProcedure
	.input(generateReplyInputSchema)
	.mutation(async ({ input, ctx }) => {
		if (!ctx.user.plan) {
			throw new TRPCError({
				code: "FORBIDDEN",
				message: "You must have an active subscription to generate replies.",
			});
		}

		// todo also validate that the user has subscription in order to use AI features (generating a reply)
		const lead = await ctx.prisma.lead.findUnique({
			where: {
				id: input.lead_id,
			},
		});

		if (!lead) {
			throw leadNotFound();
		}

		const project = await ctx.projectsService.userOwnsProject({
			userId: ctx.user.id,
			projectId: lead.project_id,
		});

		if (!project) {
			throw leadNotFound();
		}

		if (!canGenerateReply(lead)) {
			throw new TRPCError({
				code: "FORBIDDEN",
				message: "Cannot generate reply",
			});
		}

		if (!project.description) {
			throw new TRPCError({
				code: "BAD_REQUEST",
				message: "Project description is required to generate a reply",
			});
		}

		const generatedReply = await replyCompletion({
			lead,
			project,
		});

		return await ctx.prisma.lead.update({
			where: {
				id: lead.id,
			},
			data: {
				reply_status: lead.reply_status === null ? ReplyStatus.DRAFT : undefined,
				reply_text: generatedReply,
				replies_generated: {
					increment: 1,
				},
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
				reply_remote_url: true,
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
