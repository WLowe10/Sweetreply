import { orderBySchema, paginationSchema, skip } from "@/lib/pagination";
import { adminProcedure } from "@/trpc";
import { Prisma, UserRole } from "@replyon/prisma";
import { z } from "zod";

const getManyUsersInputSchema = z.object({
	search: z.string().optional(),
	sort: z
		.object({
			created_at: orderBySchema,
		})
		.partial()
		.optional(),
	filter: z
		.object({
			verified: z.boolean(),
			role: z.array(z.nativeEnum(UserRole)),
		})
		.partial()
		.optional(),
	pagination: paginationSchema,
});

export const getManyUsersHandler = adminProcedure.input(getManyUsersInputSchema).query(async ({ input, ctx }) => {
	const { search, filter, pagination, sort } = input;

	const queryWhere: Prisma.UserWhereInput = {};

	const queryOrderBy: Prisma.UserOrderByWithAggregationInput = {
		created_at: "asc",
	};

	if (search && search.length > 0) {
		queryWhere.OR = [
			{
				first_name: {
					contains: search,
					mode: "insensitive",
				},
			},
			{
				last_name: {
					contains: search,
					mode: "insensitive",
				},
			},
			{
				email: {
					contains: search,
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
			queryOrderBy.created_at = sort.created_at;
		}
	}

	const userCount = await ctx.prisma.user.count({
		where: queryWhere,
	});

	const users = await ctx.prisma.user.findMany({
		where: queryWhere,
		select: {
			id: true,
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
