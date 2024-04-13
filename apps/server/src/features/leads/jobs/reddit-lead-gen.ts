import { CronJob } from "cron";
import { generateLeadsQueue } from "../queues/generate-leads";
import { prisma } from "@/lib/db";
import { logger } from "@/lib/logger";
import { test, parse } from "liqe";
import axios from "axios";

/*
export const redditLeadGenJob = CronJob.from({
	cronTime: "* * * * *",
	// cronTime: "* * * * *", // uncomment this to run every minute
	onTick: async () => {
		logger.info("Generating reddit leads");
		const projects = await prisma.project.findMany({});
	},
});
*/

/*
	let id = parseInt(startId, 36);

	let urls = [];

	for (let i = 0; i < 20; i++) {
		let ids = [];

		// should loop 100 times
		for (let j = 0; j < 100; j++) {
			ids.push("t3_" + id.toString(36));

			id = id - 1;
		}

		urls.push("https://api.reddit.com/api/info.json?id=" + ids.join(","));
	}
    */

const client = axios.create({
	headers: {
		"User-Agent":
			"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
	},
});

function generateDescendingRedditIds(startId: string, amount: number) {
	let id = parseInt(startId, 36);
	let ids: string[] = [];

	for (let i = 0; i < amount; i++) {
		ids.push(id.toString(36));

		id = id - 1;
	}

	return ids;
}

function generateRedditInfoUrls(ids: string[]) {
	let urls: string[] = [];

	for (let i = 0; i < ids.length; i += 100) {
		const chunk = ids.slice(i, i + 100);

		urls.push("https://api.reddit.com/api/info.json?id=" + chunk.join(","));
	}

	return urls;
}

async function start() {
	const projects = await prisma.project.findMany({
		where: {
			query: {
				not: null,
			},
		},
	});

	// get the most recent reddit lead to check later to make sure we aren't checking posts or comments before this lead

	// const mostRecentLead = await prisma.lead.findFirst({
	// 	where: {
	// 		platform: "reddit",
	// 	},
	// 	orderBy: {
	// 		date: "desc",
	// 	},
	// });

	// for some reason ?limit = 1 doesn't work most of the time, therefore using limit=5 to be safe
	const newestPostResponse = await client.get("https://www.reddit.com/r/all/new/.json?limit=5");
	const body = newestPostResponse.data;

	const mostRecentPostId = body["data"]["children"][0]["data"]["id"];
	const startId = mostRecentPostId;

	// const startId = "1c2r7l0";

	// we fetch 2000 reddit posts every time
	const ids = generateDescendingRedditIds(startId, 2000).map((id) => "t3_" + id);

	// ? this is for comments
	// const ids = generateDescendingRedditIds(startCommentId, 2000).map((id) => "t1_" + id);

	const urls = generateRedditInfoUrls(ids);

	const newPostsResults = await Promise.all(
		urls.map(async (url) => {
			const response = await client.get(url);

			return response.data;
		})
	);

	for (const newPostGroup of newPostsResults) {
		const newPosts = newPostGroup["data"]["children"];

		for (const post of newPosts) {
			const data = post.data;

			// console.log(data);

			const payload = {
				remote_id: data.id,
				platform: "reddit",
				type: "post",
				channel: data.subreddit,
				remote_channel_id: data.subreddit_id,
				username: data.author,
				remote_user_id: data.author_fullname,
				title: data.title,
				content: data.selftext,
				date: new Date(data.created * 1000),
				remote_url: data.url,
			};

			// users can be deleted after they send a post, make sure that we dont try to turn it into a lead
			if (!payload.remote_user_id) {
				continue;
			}

			// this currently doesn't allow filtering by subreddit in the query (e.g., "subreddit:replyon")
			const searchDocument = {
				title: payload.title,
				content: payload.content,
			};

			// should projects be processed in parallel here?
			for (const project of projects) {
				const isMatch = test(parse(project.query as string), searchDocument);

				if (isMatch) {
					const existingLead = await prisma.lead.findFirst({
						where: {
							project_id: project.id,
							remote_id: payload.remote_id,
						},
					});

					if (!existingLead) {
						await prisma.lead.create({
							data: {
								...payload,
								project_id: project.id,
							},
						});
					}
				}
			}

			/**
             * 
                const id = data.id;
                const parentId = data.parent_id;
                const subreddit = data.subreddit;
                const content = data.body
             * 
             */

			// console.log({
			// 	id,
			// 	subreddit,
			// 	title,
			// 	content,
			// });

			// if (data.title.includes("No arms goalie")) {
			// 	console.log(data.title);
			// }
		}
	}
}

start();
