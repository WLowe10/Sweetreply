import { redditThing, type RedditThing } from "./constants";

export const createThing = (type: RedditThing, id: string) => `${redditThing[type]}_${id}`;

export const extractIdFromThing = (thing: string) => thing.slice(3);
