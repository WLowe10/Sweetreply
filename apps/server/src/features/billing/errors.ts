import { TRPCError } from "@trpc/server";

export const mustBeSubscribed = () =>
	new TRPCError({
		code: "FORBIDDEN",
		message: "You must have an active subscription to do this",
	});
