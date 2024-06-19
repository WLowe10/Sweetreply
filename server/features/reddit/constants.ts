export const RedditThing = {
	comment: "t1",
	account: "t2",
	link: "t3",
	message: "t4",
	subreddit: "t5",
	award: "t6",
} as const;

export const redditConstants = {
	commentMaxLength: 4096,
} as const;

export type RedditThingType = keyof typeof RedditThing;
export type RedditThingKeyType = (typeof RedditThing)[RedditThingType];
