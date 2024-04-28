import { TRPCError } from "@trpc/server";

export const mustBeAdmin = () =>
	new TRPCError({
		code: "FORBIDDEN",
		message: "You are not able to do this",
	});
