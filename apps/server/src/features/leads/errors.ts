import { TRPCError } from "@trpc/server";

export const leadNotFound = () =>
	new TRPCError({
		code: "NOT_FOUND",
		message: "Lead not found",
	});

export const replyAlreadySent = () => {
	new TRPCError({
		code: "BAD_REQUEST",
		message: "This reply has already been sent",
	});
};

export const leadHasNoReply = () =>
	new TRPCError({
		code: "BAD_REQUEST",
		message: "This lead has no reply",
	});

export const failedToSendReply = () =>
	new TRPCError({
		code: "INTERNAL_SERVER_ERROR",
		message: "Failed to send reply",
	});

export const failedToEditReply = () =>
	new TRPCError({
		code: "INTERNAL_SERVER_ERROR",
		message: "Failed to edit reply",
	});

export const failedToGenerateReply = () =>
	new TRPCError({
		code: "INTERNAL_SERVER_ERROR",
		message: "Failed to generate reply",
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
