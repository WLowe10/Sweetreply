import { TRPCError } from "@trpc/server";

export const leadNotFound = () =>
	new TRPCError({
		code: "NOT_FOUND",
		message: "Lead not found",
	});

export const leadAlreadyReplied = () => {
	new TRPCError({
		code: "BAD_REQUEST",
		message: "This lead has already been replied to",
	});
};

export const leadHasNoReply = () =>
	new TRPCError({
		code: "BAD_REQUEST",
		message: "This lead has no reply",
	});

export const failedToReply = () =>
	new TRPCError({
		code: "INTERNAL_SERVER_ERROR",
		message: "Failed to reply",
	});

export const failedToDeleteReply = () =>
	new TRPCError({
		code: "INTERNAL_SERVER_ERROR",
		message: "Failed to delete reply",
	});

export const failedToUndoReply = () =>
	new TRPCError({
		code: "INTERNAL_SERVER_ERROR",
		message: "Failed to undo reply",
	});

export const failedToCancelReply = () =>
	new TRPCError({
		code: "INTERNAL_SERVER_ERROR",
		message: "Failed to cancel scheduled reply",
	});
