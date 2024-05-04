import axios, { type Axios } from "axios";
import { UserAgents } from "@sweetreply/shared/constants";
import { generateDescendingRedditIds, generateBatchedRedditInfoUrls } from "../../utils/reddit";
import { RedditThing } from "@sweetreply/shared/features/reddit/constants";
import { extractIdFromThing } from "@sweetreply/shared/features/reddit/utils";
import { LeadPlatform, LeadType } from "@sweetreply/shared/features/leads/constants";
import { getAxiosScrapingProxy, scrapingProxyIsDefined } from "@lib/utils";

export class RedditPostSlurper {
	private client: Axios;
	private prevSuccessfulBatchStartId: string | undefined;

	constructor() {
		this.client = axios.create({
			proxy: getAxiosScrapingProxy(),
			headers: {
				"User-Agent": UserAgents.chrome,
			},
		});
	}

	public async slurp() {
		const newLatestPostId = await this.getLatestItemId();

		// should set max
		const slurpAmount = this.prevSuccessfulBatchStartId
			? Math.min(
					parseInt(newLatestPostId, 36) - parseInt(this.prevSuccessfulBatchStartId, 36),
					10000
				)
			: 2000;

		const ids = generateDescendingRedditIds(newLatestPostId, slurpAmount, RedditThing.link);
		const urls = generateBatchedRedditInfoUrls(ids);

		const newPostsResults = await Promise.all(
			urls.map(async (url) => {
				const response = await this.client.get(url, { timeout: 10000 });

				return response.data;
			})
		);

		let leads = [];

		for (const newPostGroup of newPostsResults) {
			const newPosts = newPostGroup["data"]["children"];

			for (const post of newPosts) {
				const postData = post.data;

				// users can be deleted after they send a post, make sure that we dont try to turn it into a lead
				if (
					!postData.subreddit_id ||
					!postData.author_fullname ||
					postData.title === "[removed]" ||
					postData.content === "[removed]"
				) {
					continue;
				}

				leads.push(this.getLead(postData));
			}
		}

		this.prevSuccessfulBatchStartId = newLatestPostId;

		return leads;
	}

	public async getLatestItemId(): Promise<string> {
		const response = await this.client.get("https://www.reddit.com/r/all/new/.json");

		return response.data["data"]["children"][0]["data"]["id"];
	}

	public getLead(redditPost: any) {
		return {
			platform: LeadPlatform.REDDIT,
			type: LeadType.POST,
			is_nsfw: redditPost.over_18,
			remote_id: redditPost.id,
			group: redditPost.subreddit,
			remote_group_id: extractIdFromThing(redditPost.subreddit_id),
			username: redditPost.author,
			remote_user_id: extractIdFromThing(redditPost.author_fullname),
			title: redditPost.title,
			content: redditPost.selftext,
			remote_url: `https://www.reddit.com/r/${redditPost.subreddit}/comments/${redditPost.id}`,
			date: new Date(redditPost.created_utc * 1000),
		};
	}

	public getSearchDocument(lead: any) {
		return {
			title: lead.title,
			content: lead.content,
		};
	}
}
