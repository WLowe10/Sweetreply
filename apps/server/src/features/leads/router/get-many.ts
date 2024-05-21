import { authenticatedProcedure } from "@features/auth/procedures";
import { paginationSchema, orderBySchema, skip } from "@lib/pagination";
import { projectNotFound } from "@features/projects/errors";
import { ReplyStatus } from "@sweetreply/shared/features/leads/constants";
import { z } from "zod";
import type { Prisma } from "@sweetreply/prisma";

const getManyLeadsInputSchema = z.object({
	projectId: z.string(),
	pagination: paginationSchema,
	query: z.string().optional(),
	filter: z
		.object({
			reply_status: z.nativeEnum(ReplyStatus),
		})
		.partial()
		.optional(),
	sort: z
		.object({
			date: orderBySchema,
		})
		.partial()
		.optional(),
});

export const getManyLeadsHandler = authenticatedProcedure
	.input(getManyLeadsInputSchema)
	.query(async ({ input, ctx }) => {
		const userOwnsProject = await ctx.projectsService.userOwnsProject({
			userID: ctx.user.id,
			projectID: input.projectId,
		});

		if (!userOwnsProject) {
			throw projectNotFound();
		}

		const { pagination, query, filter, sort } = input;

		const queryWhere: Prisma.LeadWhereInput = {
			project_id: input.projectId,
		};

		const queryOrderBy: Prisma.LeadOrderByWithRelationInput = {
			date: "desc",
		};

		if (query && query.length > 0) {
			queryWhere.OR = [
				{
					username: {
						contains: query,
						mode: "insensitive",
					},
				},
				{
					content: {
						contains: query,
						mode: "insensitive",
					},
				},
				{
					reply_text: {
						contains: query,
						mode: "insensitive",
					},
				},
				{
					group: {
						contains: query,
						mode: "insensitive",
					},
				},
			];
		}

		if (filter) {
			if (filter.reply_status) {
				if (filter.reply_status === ReplyStatus.NONE) {
					queryWhere.reply_status = null;
				} else {
					queryWhere.reply_status = filter.reply_status;
				}
			}
		}

		if (sort) {
			if (sort.date) {
				queryOrderBy.date = sort.date;
			}
		}

		const leadsCount = await ctx.prisma.lead.count({
			where: queryWhere,
		});

		const leads = await ctx.prisma.lead.findMany({
			where: queryWhere,
			orderBy: queryOrderBy,
			take: pagination.limit,
			skip: skip(pagination.page, pagination.limit),
			select: {
				id: true,
				username: true,
				remote_url: true,
				date: true,
				content: true,
				reply_status: true,
				platform: true,
			},
		});

		return {
			total: leadsCount,
			data: leads,
		};
	});
