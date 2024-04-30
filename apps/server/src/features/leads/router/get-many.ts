import { authenticatedProcedure } from "@features/auth/procedures";
import { paginationSchema, orderBySchema, skip } from "@lib/pagination";
import { z } from "zod";
import { projectNotFound } from "@features/projects/errors";
import type { Prisma } from "@sweetreply/prisma";

const getManyLeadsInputSchema = z.object({
	projectId: z.string(),
	pagination: paginationSchema,
	query: z.string().optional(),
	filter: z
		.object({
			platform: z.enum(["reddit"]),
			replied: z.boolean(),
		})
		.partial()
		.optional(),
	sort: z
		.object({
			date: orderBySchema,
			replied_at: orderBySchema,
		})
		.partial()
		.optional(),
});

export const getManyLeadsHandler = authenticatedProcedure
	.input(getManyLeadsInputSchema)
	.query(async ({ input, ctx }) => {
		const userOwnsProject = await ctx.projectsService.userOwnsProject({
			userId: ctx.user.id,
			projectId: input.projectId,
		});

		if (!userOwnsProject) {
			throw projectNotFound();
		}

		const { pagination, query, filter, sort } = input;

		const queryWhere: Prisma.LeadWhereInput = {
			project_id: input.projectId,
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
					channel: {
						contains: query,
						mode: "insensitive",
					},
				},
			];
		}

		if (filter) {
			if (filter.platform) {
				queryWhere.platform = filter.platform;
			}

			if (typeof filter.replied === "boolean") {
				if (filter.replied === true) {
					queryWhere.replied_at = {
						not: null,
					};
				} else {
					queryWhere.replied_at = null;
				}
			}
		}

		if (sort) {
			// todo
		}

		const leadsCount = await ctx.prisma.lead.count({
			where: queryWhere,
		});

		const leads = await ctx.prisma.lead.findMany({
			where: queryWhere,
			take: pagination.limit,
			skip: skip(pagination.page, pagination.limit),
			orderBy: {
				date: "desc",
			},
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
