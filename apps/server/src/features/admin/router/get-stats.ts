import { adminProcedure } from "@features/admin/procedures";

export const getStatsHandler = adminProcedure.query(async ({ ctx }) => {
	const userCount = await ctx.prisma.user.count();
	const projectCount = await ctx.prisma.project.count();
	const botCount = await ctx.prisma.bot.count();

	return {
		users: {
			count: userCount,
		},
		projects: {
			count: projectCount,
		},
		bots: {
			count: botCount,
		},
	};
});
