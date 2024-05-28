import { min } from "date-fns";
import type { ZodArray, ZodCustomIssue } from "zod";

export const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

export const sleepRange = (min: number, max: number) =>
	sleep(Math.floor(Math.random() * (max - min + 1)) + min);

export const randomRange = (min: number, max: number) =>
	Math.floor(Math.random() * (max - min + 1)) + min;

export const pluralize = (count: number, noun: string, suffix = "s") =>
	`${count} ${noun}${count !== 1 ? suffix : ""}`;

export type ProxyURLConfig = {
	user: string;
	pass: string;
	host: string;
	port: string | number;
};

export const buildProxyURL = (opts: ProxyURLConfig) =>
	`http://${opts.user}:${opts.pass}@${opts.host}:${opts.port}`;

export const isDev = (): boolean => {
	return process.env.NODE_ENV === "development";
};

export const uniqueSchema = (schema: ZodArray<any>, issue?: ZodCustomIssue) =>
	schema.refine((data) => new Set(data).size === data.length, issue);
