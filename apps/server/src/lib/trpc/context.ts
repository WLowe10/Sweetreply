import { prisma } from "@lib/db";
import { logger } from "@lib/logger";
import { stripe } from "@lib/client/stripe";
import * as authService from "@features/auth/service";
import * as emailService from "@features/email/service";
import * as projectsService from "@features/projects/service";
import * as leadsService from "@features/leads/service";
import * as leadEngineService from "@features/lead-engine/service";
import * as botsService from "@features/bots/service";
import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import type { Request, Response } from "express";

type CreateContextOptions = {
	req: Request;
	res: Response;
};

function createInnerContext(opts: CreateContextOptions) {
	return {
		req: opts.req,
		res: opts.res,
		logger,
		prisma,
		stripe,
		authService,
		emailService,
		projectsService,
		leadsService,
		leadEngineService,
		botsService,
		user: null,
		session: null,
	};
}

export function createContext(
	opts: CreateExpressContextOptions
): ReturnType<typeof createInnerContext> {
	const { req, res } = opts;

	return createInnerContext({
		req,
		res,
	});
}
