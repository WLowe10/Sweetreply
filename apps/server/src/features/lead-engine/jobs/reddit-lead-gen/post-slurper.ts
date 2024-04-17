import axios, { type Axios } from "axios";
import { parse, test } from "liqe";
import { userAgents } from "@/lib/constants";
import { prisma } from "@/lib/db";
import { generateDescendingRedditIds, generateBatchedRedditInfoUrls } from "./utils";
import { logger } from "@/lib/logger";
import type { Prisma, Project } from "@sweetreply/prisma";
import { processLeadQueue } from "../../queues/process-lead";

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

	public async slurp(projects: Project[]) {
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

		const startTimestamp = Date.now();

		logger.info(`Began slurping ${slurpAmount} reddit posts`);

		const newPostsResults = await Promise.all(
			urls.map(async (url) => {
				const response = await this.client.get(url);

				return response.data;
			})
		);

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

				// this currently doesn't allow filtering by subreddit in the query (e.g., "subreddit:replyon")
				const searchDocument = this.getSearchDocument(postData);

				// should projects be processed in parallel here?
				for (const project of projects) {
					/**
					 * Comment for later
					 * To filter out NSFW reddit posts, the postData has a key called "over_18" which is a boolean
					 */

					if (
						project.reddit_included_subreddits.length > 0 &&
						!project.reddit_included_subreddits.includes(lead.channel)
					) {
						continue;
					}

					if (
						project.reddit_excluded_subreddits.length > 0 &&
						project.reddit_excluded_subreddits.includes(lead.channel)
					) {
						continue;
					}

					const isMatch = test(parse(project.query as string), searchDocument);

					if (isMatch) {
						const existingLead = await prisma.lead.findFirst({
							where: {
								project_id: project.id,
								remote_id: lead.remote_id,
							},
						});

						if (!existingLead) {
							const newLead = await prisma.lead.create({
								data: {
									...lead,
									project_id: project.id,
								},
							});

							processLeadQueue.add({
								lead_id: newLead.id,
							});
						}
					}
				}
			}
		}

		this.prevSuccessfulBatchStartId = newLatestPostId;

		logger.info(
			`Finished slurping ${slurpAmount} reddit posts in ${Date.now() - startTimestamp}ms`
		);
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
