import { adminProcedure } from "@/trpc";

export const getStatsHandler = adminProcedure.query(async ({ ctx }) => {
	const userCount = await ctx.prisma.user.count();

	ctx.prisma.$queryRaw`select * from "users" WHERE id = 1`;

	return {
		total_users: userCount,
	};
});
