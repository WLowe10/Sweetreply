import { adminProcedure } from "@/trpc";

export const getManyBotsHandler = adminProcedure.query(async ({ ctx }) => {
	const botCount = await ctx.prisma.bot.count();
	const bots = await ctx.prisma.bot.findMany();

	return {
		total: botCount,
		data: bots,
	};
});
