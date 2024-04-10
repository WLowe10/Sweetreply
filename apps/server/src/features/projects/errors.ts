import { TRPCError } from "@trpc/server";

export const projectNotFound = () =>
	new TRPCError({
		code: "NOT_FOUND",
		message: "Project not found",
	});
