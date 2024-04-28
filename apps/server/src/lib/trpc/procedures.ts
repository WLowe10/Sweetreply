import { trpc } from "./trpc";
import { RateLimiterMemory } from "rate-limiter-flexible";
import { TRPCError } from "@trpc/server";

const rateLimiter = new RateLimiterMemory({
	points: 1,
	duration: 60,
});

// base procedure
export const publicProcedure = trpc.procedure;

export const ratelimitedPublicProcedure = publicProcedure.use(async ({ ctx, next }) => {
	const ip = ctx.req.ip;

	if (!ip) {
		throw new TRPCError({
			code: "TOO_MANY_REQUESTS",
			message: "Rate limit exceeded. Please try again later.",
		});
	}

	try {
		await rateLimiter.consume(ip as string);

		return next();
	} catch {
		throw new TRPCError({
			code: "TOO_MANY_REQUESTS",
			message: "Rate limit exceeded. Please try again later.",
		});
	}
});
