import { adminProcedure } from "@/trpc";
import { prisma } from "@/lib/db";

function queryUserData({
	startDate,
	endDate,
	interval = "day",
}: {
	startDate: Date;
	endDate: Date;
	interval?: "day" | "week" | "month";
}) {
	const startTimestamp = startDate.toISOString();
	const endTimestamp = endDate.toISOString();

	switch (interval) {
		case "day":
			return prisma.$queryRaw`
				SELECT DATE_TRUNC('day', created_at) AS signup_date, COUNT(id) AS signup_count
				FROM auth_user
				WHERE created_at >= ${startTimestamp}::timestamp AND created_at < ${endTimestamp}::timestamp
				GROUP BY DATE_TRUNC('day', created_at)
				ORDER BY signup_date
			`;
		case "week":
			return prisma.$queryRaw`
				SELECT DATE_TRUNC('week', created_at) AS signup_date, COUNT(id) AS signup_count
				FROM auth_user
				WHERE created_at >= ${startTimestamp}::timestamp AND created_at < ${endTimestamp}::timestamp
				GROUP BY DATE_TRUNC('week', created_at)
				ORDER BY signup_date
			`;
		case "month":
			return prisma.$queryRaw`
				SELECT DATE_TRUNC('month', created_at) AS signup_date, COUNT(id) AS signup_count
				FROM auth_user
				WHERE created_at >= ${startTimestamp}::timestamp AND created_at < ${endTimestamp}::timestamp
				GROUP BY DATE_TRUNC('month', created_at)
				ORDER BY signup_date
			`;
	}
}

export const getStatsHandler = adminProcedure.query(async ({ ctx }) => {
	const userCount = await ctx.prisma.user.count();

	const userChartData = await queryUserData({
		startDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
		endDate: new Date(),
		interval: "day",
	});

	const botCount = await ctx.prisma.bot.count();
	const activeBotCount = await ctx.prisma.bot.count({
		where: {
			active: true,
		},
	});

	return {
		users: {
			total: userCount,
			chart: userChartData,
		},
		socialAccounts: {
			total: botCount,
			active: activeBotCount,
		},
	};
});
