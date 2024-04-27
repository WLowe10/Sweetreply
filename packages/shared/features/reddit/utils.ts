import { RedditThing, type RedditThingType } from "./constants";

export const createThing = (type: RedditThingType, id: string) => `${RedditThing[type]}_${id}`;

export const extractIdFromThing = (thing: string) => thing.slice(3);
