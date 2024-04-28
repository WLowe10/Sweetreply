import { serializeUser } from "../utils";
import { authenticatedUnverifiedProcedure } from "@auth/procedures";

export const getMeHandler = authenticatedUnverifiedProcedure.query(({ ctx }) => {
	return serializeUser(ctx.user);
});
