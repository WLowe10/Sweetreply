import { parse } from "liqe";

export const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

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
