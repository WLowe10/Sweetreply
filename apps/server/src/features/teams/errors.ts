import { TRPCError } from "@trpc/server";

export const teamNotFound = () =>
	new TRPCError({
		code: "NOT_FOUND",
		message: "Team not found",
	});
