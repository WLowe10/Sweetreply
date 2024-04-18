import { adminProcedure } from "@/trpc";
import { z } from "zod";

const getBotInputSchema = z.object({
	id: z.string(),
});

export const getBotHandler = adminProcedure.input(getBotInputSchema).query(({ input, ctx }) => {
	return ctx.prisma.bot.findUnique({
		where: {
			id: input.id,
		},
	});
});
