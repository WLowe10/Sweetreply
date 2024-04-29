import { adminProcedure } from "@features/admin/procedures";
import { createBotInputSchema } from "@sweetreply/shared/features/admin/schemas";

export const createBotHandler = adminProcedure
	.input(createBotInputSchema)
	.mutation(({ input, ctx }) => {
		return ctx.prisma.bot.create({
			data: input,
		});
	});
