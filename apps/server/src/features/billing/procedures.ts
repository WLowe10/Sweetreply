import { authenticatedProcedure } from "@auth/procedures";
import { mustBeSubscribed } from "./errors";

export const subscribedProcedure = authenticatedProcedure.unstable_concat(
	authenticatedProcedure.use(({ ctx, next }) => {
		if (!ctx.user.plan) {
			throw mustBeSubscribed();
		}

		return next();
	})
);
