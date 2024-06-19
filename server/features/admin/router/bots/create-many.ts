import { adminProcedure } from "~/features/admin/procedures";
import { z } from "zod";

const createManyBotsInputSchema = z.object({
	bots: z.array(
		z.object({
			platform: z.enum(["reddit"]),
			username: z.string(),
			password: z.string(),
		})
	),
});

export const createManyBotsHandler = adminProcedure
	.input(createManyBotsInputSchema)
	.mutation(async ({ input, ctx }) => {
		const newAccounts = input.bots.map(bot => ({
			...bot,
			status: "unrestricted",
		}));

		await ctx.prisma.bot.createMany({
			data: newAccounts,
		});
	});
