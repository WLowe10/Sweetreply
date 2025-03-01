import { orderBySchema, paginationSchema, skip } from "@lib/pagination";
import { adminProcedure } from "@features/admin/procedures";
import { z } from "zod";
import type { Prisma } from "@sweetreply/prisma";

const getManyUsersInputSchema = z.object({
	query: z.string().optional(),
	sort: z
		.object({
			created_at: orderBySchema,
			sessions: orderBySchema,
		})
		.partial()
		.optional(),
	filter: z
		.object({
			verified: z.boolean(),
			role: z.array(z.enum(["user", "admin"])),
		})
		.partial()
		.optional(),
	pagination: paginationSchema,
});

export const getManyUsersHandler = adminProcedure
	.input(getManyUsersInputSchema)
	.query(async ({ input, ctx }) => {
		const { query, filter, pagination, sort } = input;

		const queryWhere: Prisma.UserWhereInput = {};

		const queryOrderBy: Prisma.UserOrderByWithRelationInput[] = [];

		if (query && query.length > 0) {
			queryWhere.OR = [
				{
					first_name: {
						contains: query,
						mode: "insensitive",
					},
				},
				{
					last_name: {
						contains: query,
						mode: "insensitive",
					},
				},
				{
					email: {
						contains: query,
						mode: "insensitive",
					},
				},
			];
		}

		if (filter && Object.keys(filter).length > 0) {
			if (typeof filter.verified === "boolean") {
				if (filter.verified === true) {
					queryWhere.verified_at = {
						not: null,
					};
				} else {
					queryWhere.verified_at = null;
				}
			}

			if (filter.role && filter.role.length > 0) {
				queryWhere.role = {
					in: filter.role,
				};
			}
		}

		if (sort && Object.keys(sort).length > 0) {
			if (sort.created_at) {
				queryOrderBy.push({
					created_at: sort.created_at,
				});
			}

			if (sort.sessions) {
				queryOrderBy.push({
					sessions: {
						_count: sort.sessions,
					},
				});
			}
		}

		const userCount = await ctx.prisma.user.count({
			where: queryWhere,
		});

		const users = await ctx.prisma.user.findMany({
			where: queryWhere,
			select: {
				id: true,
				role: true,
				first_name: true,
				last_name: true,
				email: true,
				verified_at: true,
				created_at: true,
				_count: {
					select: {
						sessions: true,
					},
				},
			},
			orderBy: queryOrderBy,
			skip: skip(pagination.page, pagination.limit),
			take: pagination.limit,
		});

		return {
			total: userCount,
			data: users,
		};
	});
