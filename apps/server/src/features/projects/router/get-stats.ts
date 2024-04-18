import { authenticatedProcedure } from "@/trpc";
import { z } from "zod";
import { projectNotFound } from "../errors";

const getStatsInputSchema = z.object({
	projectId: z.string(),
});

export const getStatsHandler = authenticatedProcedure
	.input(getStatsInputSchema)
	.query(async ({ input, ctx }) => {
		const project = await ctx.projectsService.userOwnsProject({
			userId: ctx.user.id,
			projectId: input.projectId,
		});

		if (!project) {
			throw projectNotFound();
		}

		const leadCount = await ctx.prisma.lead.count({
			where: {
				project_id: input.projectId,
			},
		});

		const replyCount = await ctx.prisma.lead.count({
			where: {
				project_id: input.projectId,
				replied_at: {
					not: null,
				},
			},
		});

		const mostRecentLead = await ctx.prisma.lead.findFirst({
			where: {
				project_id: input.projectId,
			},
			select: {
				created_at: true,
			},
			orderBy: {
				created_at: "desc",
			},
		});

		const mostRecentReply = await ctx.prisma.lead.findFirst({
			where: {
				project_id: input.projectId,
				replied_at: {
					not: null,
				},
			},
			select: {
				replied_at: true,
			},
			orderBy: {
				replied_at: "asc",
			},
		});

		return {
			project: {
				created_at: project.created_at,
			},
			tokens: {
				count: project.tokens,
			},
			leads: {
				count: leadCount,
				mostRecent: mostRecentLead?.created_at,
			},
			replies: {
				count: replyCount,
				mostRecent: mostRecentReply?.replied_at,
			},
		};
	});
