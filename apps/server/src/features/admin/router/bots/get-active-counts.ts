import { adminProcedure } from "@features/admin/procedures";

export const getActiveCountsHandler = adminProcedure.query(async ({ ctx }) => {
	const redditActiveBotCount = await ctx.prisma.bot.count({
		where: {
			active: true,
			platform: "reddit",
		},
	});

	return {
		reddit: redditActiveBotCount,
	};
});
