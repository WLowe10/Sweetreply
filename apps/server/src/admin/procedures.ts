import { mustBeAdmin } from "./errors";
import { authenticatedProcedure } from "@auth/procedures";

// ensures that the user is an admin
export const adminProcedure = authenticatedProcedure.use(({ ctx, next }) => {
	if (ctx.user.role !== "admin") {
		throw mustBeAdmin();
	}

	return next();
});
