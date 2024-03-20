import { TRPCError } from "@trpc/server";

export function mustBeVerified() {
	return new TRPCError({
		code: "FORBIDDEN",
		message: "You must verify your account",
	});
}

export function mustBeSignedIn() {
	return new TRPCError({
		code: "UNAUTHORIZED",
		message: "You must be signed in",
	});
}

export function mustBeAdmin() {
	return new TRPCError({
		code: "FORBIDDEN",
		message: "You are not able to do this",
	});
}

export function alreadySignedIn() {
	return new TRPCError({
		code: "FORBIDDEN",
		message: "You are already signed in",
	});
}

export function emailAlreadyRegistered() {
	return new TRPCError({
		code: "CONFLICT",
		message: "Email already registered",
	});
}
