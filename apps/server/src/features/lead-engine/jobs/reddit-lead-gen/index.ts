import { CronJob } from "cron";
import { prisma } from "@/lib/db";
import { logger } from "@/lib/logger";
import { RedditPostSlurper } from "./post-slurper";
import { Project } from "@sweetreply/prisma";
import { parse, test } from "liqe";
import pLimit from "p-limit";
import { processLeadQueue } from "../../queues/process-lead";

const postSlurper = new RedditPostSlurper();

const slurpPosts = async (projects: Project[]) => {
	try {
		const posts = await postSlurper.slurp();
		const timeStart = Date.now();

		for (const post of posts) {
			const searchDocument = postSlurper.getSearchDocument(post);
			const lead = postSlurper.getLead(post);
			const limit = pLimit(20);

			await Promise.all(
				projects.map((project) =>
					limit(async () => {
						if (!project.reddit_allow_nsfw && post.over_18) {
							return;
						}

						if (
							project.reddit_included_subreddits.length > 0 &&
							!project.reddit_included_subreddits.includes(lead.channel)
						) {
							return;
						}

						if (
							project.reddit_excluded_subreddits.length > 0 &&
							project.reddit_excluded_subreddits.includes(lead.channel)
						) {
							return;
						}

						let isMatch = false;

						try {
							isMatch = test(parse(project.query as string), searchDocument);
						} catch {
							// noop
						}

						if (!isMatch) {
							return;
						}

						const existingLead = await prisma.lead.findFirst({
							where: {
								project_id: project.id,
								remote_id: lead.remote_id,
							},
						});

						if (existingLead) {
							return;
						}

						const newLead = await prisma.lead.create({
							data: {
								...lead,
								project_id: project.id,
							},
						});

						processLeadQueue.add({
							lead_id: newLead.id,
						});
					})
				)
			);
		}

		logger.info(`Slurped ${posts.length} reddit posts in ${Date.now() - timeStart}ms`);
	} catch (err) {
		logger.error(err, "Reddit slurp failed");
	}
};

// todo, job should not start if already running
export const redditLeadGenJob = CronJob.from({
	cronTime: "* * * * *",
	onTick: async () => {
		const projects = await prisma.project.findMany({
			where: {
				reddit_monitor_enabled: true,
				AND: [
					{
						query: {
							not: null,
						},
					},
					{
						query: {
							not: "",
						},
					},
				],
			},
		});

		// this currently doesn't allow filtering by subreddit in the query (e.g., "subreddit:replyon")

		await Promise.allSettled([slurpPosts(projects)]);
	},
});
