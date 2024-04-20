import { adminProcedure } from "@/trpc";

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
