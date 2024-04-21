import { authenticatedProcedure } from "@/trpc";
import { z } from "zod";
import { leadNotFound } from "../errors";

export const getLeadInputSchema = z.object({
	id: z.string().uuid(),
});

export const getLeadHandler = authenticatedProcedure
	.input(getLeadInputSchema)
	.query(async ({ input, ctx }) => {
		const lead = await ctx.prisma.lead.findFirst({
			where: {
				id: input.id,
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

		return lead;
	});
