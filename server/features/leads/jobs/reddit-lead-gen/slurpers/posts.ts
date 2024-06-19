import axios, { type Axios } from "axios";
import { UserAgents } from "~/features/bots/constants";
import { RedditThing } from "~/features/reddit/constants";
import { extractIdFromThing } from "~/features/reddit/utils";
import { LeadPlatform, LeadType } from "~/features/leads/constants";
import { getAxiosScrapingProxy } from "~/utils";
import { generateDescendingRedditIds, generateBatchedRedditInfoUrls } from "../../../lib/reddit";

export class RedditPostsSlurper {
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
		const { id: newLatestPostId, cookies } = await this.getLatestItemId();

		// should set max
		const slurpAmount = this.prevSuccessfulBatchStartId
			? Math.min(
					parseInt(newLatestPostId, 36) - parseInt(this.prevSuccessfulBatchStartId, 36),
					9500 // 95 requests is the most we can make on a single reddit rate-limiting session
				)
			: 2000;

		const ids = generateDescendingRedditIds(newLatestPostId, slurpAmount, RedditThing.link);
		const urls = generateBatchedRedditInfoUrls(ids);

		const newPostsResults = await Promise.all(
			urls.map(async url => {
				const response = await this.client.get(url, {
					timeout: 10000,
					headers: {
						Cookie: cookies,
					},
				});

				return response.data;
			})
		);

		let leads = [];

		for (const newPostGroup of newPostsResults) {
			const newPosts = newPostGroup["data"]["children"];

			for (const post of newPosts) {
				const postData = post.data;

				if (
					!postData.subreddit_id ||
					!postData.author_fullname ||
					postData.title === "[removed]" ||
					postData.selftext === "[removed]" ||
					postData.media_only === true || // don't include media only posts
					typeof postData.crosspost_parent === "string" // don't include cross posts
				) {
					continue;
				}

				leads.push(this.getLead(postData));
			}
		}

		this.prevSuccessfulBatchStartId = newLatestPostId;

		return leads;
	}

	public async getLatestItemId() {
		const response = await this.client.get("https://www.reddit.com/r/all/new/.json");
		const cookies = response.headers["set-cookie"];

		const latestId = response.data["data"]["children"][0]["data"]["id"];

		if (!cookies || cookies.length === 0) {
			throw new Error("Failed to load rate limiting cookie");
		}

		const loid = cookies.find(c => c.startsWith("loid="));

		if (!loid) {
			throw new Error("Failed to load rate limiting cookie");
		}

		return {
			id: latestId,
			cookies,
		};
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
}
