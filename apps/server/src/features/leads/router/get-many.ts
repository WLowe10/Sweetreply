import { authenticatedProcedure } from "@features/auth/procedures";
import { paginationSchema, orderBySchema, skip } from "@lib/pagination";
import { projectNotFound } from "@features/projects/errors";
import { ReplyStatus } from "@sweetreply/shared/features/leads/constants";
import { z } from "zod";
import { uniqueSchema } from "@sweetreply/shared/lib/utils";
import type { Prisma } from "@sweetreply/prisma";

const getManyLeadsInputSchema = z.object({
	projectId: z.string(),
	pagination: paginationSchema,
	query: z.string().optional(),
	filter: z
		.object({
			reply_status: uniqueSchema(z.array(z.nativeEnum(ReplyStatus)).min(1)),
			date: z.tuple([z.date(), z.date().nullish()]),
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
			if (filter.reply_status && filter.reply_status.length > 0) {
				const replyStatusIn = filter.reply_status.filter(
					(status) => status !== ReplyStatus.NONE
				);

				if (filter.reply_status.includes(ReplyStatus.NONE)) {
					queryWhere.OR = [
						{
							reply_status: null,
						},
						{
							reply_status: {
								in: replyStatusIn,
							},
						},
					];
				} else {
					queryWhere.reply_status = {
						in: replyStatusIn,
					};
				}
			}

			if (filter.date) {
				queryWhere.date = {
					gte: filter.date[0],
				};

				if (filter.date[1]) {
					queryWhere.date.lte = filter.date[1];
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
