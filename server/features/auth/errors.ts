import { TRPCError } from "@trpc/server";

export const mustBeVerified = () =>
	new TRPCError({
		code: "FORBIDDEN",
		message: "You must verify your account",
	});

export const alreadyVerified = () =>
	new TRPCError({
		code: "FORBIDDEN",
		message: "Your account is already verified",
	});

export const mustBeSignedIn = () =>
	new TRPCError({
		code: "UNAUTHORIZED",
		message: "You must be signed in",
	});

export const alreadySignedIn = () =>
	new TRPCError({
		code: "FORBIDDEN",
		message: "You are already signed in",
	});

export const emailAlreadyRegistered = () =>
	new TRPCError({
		code: "CONFLICT",
		message: "Email already registered",
	});
