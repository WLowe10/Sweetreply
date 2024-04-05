import { serializeUser } from "../utils";
import { authenticatedUnverifiedProcedure } from "@/trpc";

export const getMeHandler = authenticatedUnverifiedProcedure.query(({ ctx }) => {
	return serializeUser(ctx.user);
});
