import { adminProcedure } from "@/trpc";
import { createBotInputSchema } from "@sweetreply/shared/features/admin/schemas";

export const createBotHandler = adminProcedure
	.input(createBotInputSchema)
	.mutation(({ input, ctx }) => {
		return ctx.prisma.bot.create({
			data: input,
		});
	});
