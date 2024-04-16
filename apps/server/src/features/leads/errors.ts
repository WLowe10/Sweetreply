import { TRPCError } from "@trpc/server";

export const leadNotFound = () =>
	new TRPCError({
		code: "NOT_FOUND",
		message: "Lead not found",
	});
