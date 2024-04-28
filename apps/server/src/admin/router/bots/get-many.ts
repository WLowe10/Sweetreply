import { paginationSchema, skip } from "@lib/pagination";
import { adminProcedure } from "@admin/procedures";
import { z } from "zod";
import type { Prisma } from "@sweetreply/prisma";

const getManyBotsInputSchema = z.object({
	query: z.string().optional(),
	filter: z
		.object({
			platform: z.enum(["reddit"]),
		})
		.partial()
		.optional(),
	pagination: paginationSchema,
});

export const getManyBotsHandler = adminProcedure
	.input(getManyBotsInputSchema)
	.query(async ({ input, ctx }) => {
		const { query, filter, pagination } = input;

		const queryWhere: Prisma.BotWhereInput = {};

		if (filter) {
			if (filter.platform) {
				queryWhere.platform = filter.platform;
			}
		}

		if (query && query.length > 0) {
			queryWhere.OR = [
				{
					username: {
						mode: "insensitive",
						contains: query,
					},
				},
			];
		}

		const botCount = await ctx.prisma.bot.count({
			where: queryWhere,
		});

		const bots = await ctx.prisma.bot.findMany({
			where: queryWhere,
			include: {
				_count: {
					select: {
						leads: true,
						errors: true,
					},
				},
			},
			take: pagination.limit,
			skip: skip(pagination.page, pagination.limit),
			orderBy: {
				created_at: "desc",
			},
		});

		return {
			total: botCount,
			data: bots,
		};
	});
