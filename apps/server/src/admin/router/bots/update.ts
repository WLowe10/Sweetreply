import { adminProcedure } from "@admin/procedures";
import { updateBotInputSchema } from "@sweetreply/shared/features/admin/schemas";

export const updateBotHandler = adminProcedure
	.input(updateBotInputSchema)
	.mutation(({ input, ctx }) => {
		return ctx.prisma.bot.update({
			where: {
				id: input.id,
			},
			data: input.data,
		});
	});
