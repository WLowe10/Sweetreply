import axios, { type Axios } from "axios";
import { UserAgents } from "@sweetreply/shared/constants";
import { generateDescendingRedditIds, generateBatchedRedditInfoUrls } from "../../utils/reddit";
import { RedditThing } from "@sweetreply/shared/features/reddit/constants";
import { extractIdFromThing } from "@sweetreply/shared/features/reddit/utils";
import { LeadPlatform, LeadType } from "@sweetreply/shared/features/leads/constants";

export class RedditCommentSlurper {
	private client: Axios;
	private prevSuccessfulBatchStartId: string | undefined;

	constructor() {
		this.client = axios.create({
			headers: {
				"User-Agent": UserAgents.chrome,
			},
		});
	}

	public async slurp() {
		const newLatestCommentId = await this.getLatestItemId();

		// should set max
		const slurpAmount = this.prevSuccessfulBatchStartId
			? Math.min(
					parseInt(newLatestCommentId, 36) -
						parseInt(this.prevSuccessfulBatchStartId, 36),
					15000
				)
			: 5000;

		const ids = generateDescendingRedditIds(
			newLatestCommentId,
			slurpAmount,
			RedditThing.comment
		);

		const urls = generateBatchedRedditInfoUrls(ids);

		const newCommentsResults = await Promise.all(
			urls.map(async (url) => {
				const response = await this.client.get(url, { timeout: 10000 });

				return response.data;
			})
		);

		let leads = [];

		for (const newCommentGroup of newCommentsResults) {
			const newComments = newCommentGroup["data"]["children"];

			for (const comment of newComments) {
				const commentData = comment.data;

				if (
					!commentData.author_fullname ||
					!commentData.subreddit_id ||
					commentData.body === "[removed]"
				) {
					continue;
				}

				leads.push(this.getLead(commentData));
			}
		}

		this.prevSuccessfulBatchStartId = newLatestCommentId;

		return leads;
	}

	public async getLatestItemId(): Promise<string> {
		const response = await this.client.get("https://www.reddit.com/r/all/comments/.json");

		return response.data["data"]["children"][0]["data"]["id"];
	}

	public getLead(redditComment: any) {
		return {
			platform: LeadPlatform.REDDIT,
			type: LeadType.COMMENT,
			is_nsfw: redditComment.over_18,
			title: null,
			channel: redditComment.subreddit,
			username: redditComment.author,
			content: redditComment.body,
			date: new Date(redditComment.created_utc * 1000),
			remote_id: redditComment.id,
			remote_url: `https://www.reddit.com/r/${redditComment.subreddit}/comments/${extractIdFromThing(redditComment.link_id)}/comment/${redditComment.id}`,
			remote_user_id: extractIdFromThing(redditComment.author_fullname),
			remote_channel_id: extractIdFromThing(redditComment.subreddit_id),
		};
	}

	public getSearchDocument(lead: any) {
		return {
			content: lead.content,
		};
	}
}
