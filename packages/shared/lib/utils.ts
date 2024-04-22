export const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

export const pluralize = (count: number, noun: string, suffix = "s") =>
	`${count} ${noun}${count !== 1 ? suffix : ""}`;
