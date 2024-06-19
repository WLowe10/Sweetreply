export type Result<T, K> = { success: true; data: T } | { success: false; error: K };
export type ResultAsync<T, K> = Promise<Result<T, K>>;

export function ok<T>(data: T): Result<T, never> {
	return { success: true, data };
}

export function err<T>(error: T): Result<never, T> {
	return {
		success: false,
		error,
	};
}
