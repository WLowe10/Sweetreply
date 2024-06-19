import { prisma } from "./prisma";
import { logger } from "./logger";
import * as authService from "../features/auth/service";
import * as botsService from "../features/bots/service";
import * as emailService from "../features/email/service";
import * as leadsService from "../features/leads/service";
import * as projectsService from "../features/projects/service";
import type { Request, Response } from "express";
import type { DataFunctionArgs } from "@remix-run/node";

export type AppContext = ReturnType<typeof getAppContext>;

declare module "@remix-run/node" {
	export interface LoaderFunctionArgs extends DataFunctionArgs {
		context: AppContext;
	}

	export interface ActionArgs extends DataFunctionArgs {
		context: AppContext;
	}
}

export function getAppContext(req: Request, res: Response) {
	return {
		req,
		res,
		prisma,
		logger,
		authService,
		botsService,
		emailService,
		leadsService,
		projectsService,
	};
}
