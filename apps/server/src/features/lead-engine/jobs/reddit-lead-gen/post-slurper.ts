import axios, { type Axios } from "axios";
import { userAgents } from "@/lib/constants";
import { generateDescendingRedditIds, generateBatchedRedditInfoUrls } from "./utils";
import { logger } from "@/lib/logger";
import type { Project } from "@sweetreply/prisma";

export class RedditPostSlurper {
	private client: Axios;
	private prevSuccessfulBatchStartId: string | undefined;

	constructor() {
		this.client = axios.create({
			headers: {
				"User-Agent": userAgents.chrome,
			},
		});
	}

	public async slurp() {
		const newLatestPostId = await this.getLatestPostId();

		// should set max
		const slurpAmount = this.prevSuccessfulBatchStartId
			? Math.min(
					parseInt(newLatestPostId, 36) - parseInt(this.prevSuccessfulBatchStartId, 36),
					10000
				)
			: 2000;

		const ids = generateDescendingRedditIds(newLatestPostId, slurpAmount, "t3");
		const urls = generateBatchedRedditInfoUrls(ids);

		const newPostsResults = await Promise.all(
			urls.map(async (url) => {
				const response = await this.client.get(url);

				return response.data;
			})
		);

		let posts = [];

		for (const newPostGroup of newPostsResults) {
			const newPosts = newPostGroup["data"]["children"];

			for (const post of newPosts) {
				const postData = post.data;
				const lead = this.getLead(postData);

				// users can be deleted after they send a post, make sure that we dont try to turn it into a lead
				if (
					!lead.remote_user_id ||
					lead.title === "[removed]" ||
					lead.content === "[removed]"
				) {
					continue;
				}

				posts.push(postData);
			}
		}

		this.prevSuccessfulBatchStartId = newLatestPostId;

		return posts;
	}

	public async getLatestPostId(): Promise<string> {
		const response = await this.client.get("https://www.reddit.com/r/all/new/.json?limit=5");

		return response.data["data"]["children"][0]["data"]["id"];
	}

	public getLead(redditPost: any) {
		return {
			platform: "reddit",
			type: "post",
			remote_id: redditPost.id,
			channel: redditPost.subreddit,
			remote_channel_id: redditPost.subreddit_id,
			username: redditPost.author,
			remote_user_id: redditPost.author_fullname,
			title: redditPost.title,
			content: redditPost.selftext,
			remote_url: redditPost.url,
			date: new Date(redditPost.created * 1000),
		};
	}

	public getSearchDocument(redditPost: any) {
		return {
			title: redditPost.title,
			content: redditPost.selftext,
		};
	}
}
