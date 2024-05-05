import { authenticatedProcedure } from "@features/auth/procedures";
import { z } from "zod";
import { projectNotFound } from "../errors";
import { subDays } from "date-fns";
import { ReplyStatus } from "@sweetreply/shared/features/leads/constants";

const getStatsInputSchema = z.object({
	projectId: z.string(),
});

export const getStatsHandler = authenticatedProcedure
	.input(getStatsInputSchema)
	.query(async ({ input, ctx }) => {
		const project = await ctx.projectsService.userOwnsProject({
			userID: ctx.user.id,
			projectID: input.projectId,
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
				reply_status: ReplyStatus.REPLIED,
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

		const leadsLast24Hours = await ctx.prisma.lead.count({
			where: {
				project_id: input.projectId,
				created_at: {
					gte: subDays(new Date(), 1),
				},
			},
		});

		const repliesLast24Hours = await ctx.prisma.lead.count({
			where: {
				project_id: input.projectId,
				reply_status: ReplyStatus.REPLIED,
				replied_at: {
					gte: subDays(new Date(), 1),
				},
			},
		});

		return {
			project: {
				created_at: project.created_at,
			},
			leads: {
				count: leadCount,
				last24HoursCount: leadsLast24Hours,
				mostRecent: mostRecentLead?.created_at,
			},
			replies: {
				count: replyCount,
				last24HoursCount: repliesLast24Hours,
				mostRecent: mostRecentReply?.replied_at,
			},
		};
	});
