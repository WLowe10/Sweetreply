export const redditThing = {
	comment: "t1",
	account: "t2",
	link: "t3",
	message: "t4",
	subreddit: "t5",
	award: "t6",
} as const;

export const redditComment = {
	maxLength: 4096,
} as const;

export type RedditThing = keyof typeof redditThing;
