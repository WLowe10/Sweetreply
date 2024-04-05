import { TRPCError } from "@trpc/server";

export function teamNotFound() {
	return new TRPCError({
		code: "NOT_FOUND",
		message: "Team not found",
	});
}
