// https://github.com/HackerNews/API

import type { HNVersion, HNItem, HNUpdates, HNUser } from "./types";

const defaultVersion: HNVersion = "v0";

export class HackerNews {
	private version: HNVersion;
	private baseUrl: URL;

	constructor(opts?: { version: HNVersion }) {
		this.version = opts?.version ?? defaultVersion;
		this.baseUrl = new URL(`https://hacker-news.firebaseio.com/${this.version}`);
	}

	public async getUser(userId: string): Promise<HNUser> {
		return this.getJsonResource(`user/${userId}`);
	}

	public async getMaxItem(): Promise<number> {
		return this.getJsonResource("maxitem");
	}

	public async getItem(itemId: number): Promise<HNItem> {
		return this.getJsonResource(`item/${itemId}`);
	}

	public async getTopStories(): Promise<HNItem> {
		return this.getJsonResource("topstories");
	}

	public async getNewStories(): Promise<HNItem> {
		return this.getJsonResource("newstories");
	}

	public async getBestStories(): Promise<HNItem> {
		return this.getJsonResource("beststories");
	}

	public async getAskStories(): Promise<HNItem> {
		return this.getJsonResource("askstories");
	}

	public async getShowStories(): Promise<HNItem> {
		return this.getJsonResource("showstories");
	}

	public async getJobStories(): Promise<HNItem> {
		return this.getJsonResource("jobstories");
	}

	public async getUpdates(): Promise<HNUpdates> {
		return this.getJsonResource("updates");
	}

	public async getJsonResource(resource: string) {
		return (await fetch(`${this.baseUrl}/${resource}.json`)).json();
	}
}
