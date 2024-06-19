export type HNVersion = "v0";

export type HNResource = "job" | "story" | "comment" | "poll" | "pollopt";

// https://github.com/HackerNews/API?tab=readme-ov-file#users
export type HNUser = {
	id: string;
	about: string;
	created: number;
	delay: number;
	karma: number;
	submitted: string[];
};

// https://github.com/HackerNews/API?tab=readme-ov-file#items
export type HNItem = {
	id: number;
	deleted?: boolean;
	type: HNResource;
	by: string;
	time: number;
	text?: string;
	dead?: boolean;
	parent?: string;
	poll?: number;
	kids?: string[];

	url?: string;
	score?: number;
	title?: string;
	parts?: string[];
	descendants?: number;
};

// https://github.com/HackerNews/API?tab=readme-ov-file#items
export type HNUpdates = {
	items: string[];
	profiles: string[];
};
