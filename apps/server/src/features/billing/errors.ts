import { TRPCError } from "@trpc/server";

export const mustBeSubscribed = () =>
	new TRPCError({
		code: "FORBIDDEN",
		message: "You must have an active subscription to do this",
	});

export const outOfReplyCredits = () =>
	new TRPCError({
		code: "FORBIDDEN",
		message: "You are out of reply credits. Please upgrade your plan or contact support.",
	});
