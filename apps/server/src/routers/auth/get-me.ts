import { serializeUser } from "@/lib/auth/utils";
import { authenticatedUnverifiedProcedure } from "@/trpc";

export const getMeHandler = authenticatedUnverifiedProcedure.query(({ ctx }) => {
	return serializeUser(ctx.user);
});
