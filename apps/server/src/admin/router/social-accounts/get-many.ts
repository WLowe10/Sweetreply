import { adminProcedure } from "@/trpc";

export const getManySocialAccountsHandler = adminProcedure.query(async ({ ctx }) => {
	const socialAccountsCount = await ctx.prisma.socialAccount.count();
	const socialAccounts = await ctx.prisma.socialAccount.findMany();

	return {
		total: socialAccountsCount,
		data: socialAccounts,
	};
});
