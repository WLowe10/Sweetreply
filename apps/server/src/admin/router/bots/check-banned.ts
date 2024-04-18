import { adminProcedure } from "@/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

const checkBannedInputSchema = z.object({
	id: z.string(),
});

export const checkBannedHandler = adminProcedure
	.input(checkBannedInputSchema)
	.query(async ({ input, ctx }) => {
		try {
			const isBanned = await ctx.botsService.checkBanned(input.id);

			return {
				isBanned: isBanned,
			};
		} catch (err) {
			throw new TRPCError({
				code: "METHOD_NOT_SUPPORTED",
				message: "Can't check for banned account on this platform",
			});
		}
	});
