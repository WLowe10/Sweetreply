import { adminProcedure } from "~/features/admin/procedures";
import { updateBotInputSchema } from "~/features/admin/schemas";

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
