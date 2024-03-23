import { serializeUser } from "@/lib/auth/utils";
import { authenticatedUnverifiedProcedure } from "@/trpc";

export const getMeHandler = authenticatedUnverifiedProcedure.query(({ ctx }) => {
	console.log(ctx.user);
	return serializeUser(ctx.user);
});
