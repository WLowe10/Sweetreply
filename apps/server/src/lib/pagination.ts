import { z } from "zod";

export type PaginationResult<T = any> = {
	total: number;
	data: T;
};

export const skip = (page: number, limit: number) => page * limit;

export function createPaginationSchema({ defaultLimit, maxLimit }: { defaultLimit: number; maxLimit: number }) {
	return z.object({
		page: z.number().int().gte(0).safe().default(0),
		limit: z.number().int().max(maxLimit).positive().safe().default(defaultLimit),
	});
}

export const paginationSchema = createPaginationSchema({
	defaultLimit: 10,
	maxLimit: 50,
});

export const orderBySchema = z.enum(["asc", "desc"]);
