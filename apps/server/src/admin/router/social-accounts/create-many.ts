import { adminProcedure } from "@/trpc";
import { z } from "zod";

const createManySocialAccountsInputSchema = z.object({
	accounts: z.array(
		z.object({
			platform: z.enum(["reddit"]),
			username: z.string(),
			password: z.string(),
		})
	),
});

export const createManySocialAccountsHandler = adminProcedure
	.input(createManySocialAccountsInputSchema)
	.mutation(async ({ input, ctx }) => {
		const newAccounts = input.accounts.map((account) => ({
			...account,
			status: "unrestricted",
		}));

		await ctx.prisma.socialAccount.createMany({
			data: newAccounts,
		});
	});
