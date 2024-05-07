import { min } from "date-fns";
import { parse } from "liqe";

export const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

export const sleepRange = (min: number, max: number) =>
	sleep(Math.floor(Math.random() * (max - min + 1)) + min);

export const pluralize = (count: number, noun: string, suffix = "s") =>
	`${count} ${noun}${count !== 1 ? suffix : ""}`;

export function isValidLiqeString(str: string) {
	let isValid = true;

	try {
		parse(str);
	} catch {
		isValid = false;
	}

	return isValid;
}

export type ProxyURLConfig = {
	user: string;
	pass: string;
	host: string;
	port: string | number;
};

export const buildProxyURL = (opts: ProxyURLConfig) =>
	`http://${opts.user}:${opts.pass}@${opts.host}:${opts.port}`;
