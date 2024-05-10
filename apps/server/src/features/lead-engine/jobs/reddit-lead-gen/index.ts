import pLimit from "p-limit";
import { CronJob } from "cron";
import { prisma } from "@lib/db";
import { logger } from "@lib/logger";
import { RedditPostSlurper } from "./post-slurper";
import { Project } from "@sweetreply/prisma";
import { parse, test } from "liqe";
import * as leadEngineService from "../../service";

// comments slurping is disabled for now due to the possibility of an infinite loop of bot replies,
// since the bot replies will be picked up by the comment slurper

const postSlurper = new RedditPostSlurper();

// these are the recommended subreddits to blacklist in the reddit botiquette
const blacklistedSubreddits = ["suicidewatch", "depression"];

let isRunning = false;

export const redditLeadGenJob = CronJob.from({
	cronTime: "* * * * *",
	onTick: async function () {
		if (isRunning) {
			return;
		}

		isRunning = true;

		try {
			const projects = await prisma.project.findMany({
				where: {
					reddit_monitor_enabled: true,
					query: {
						not: null,
					},
				},
				include: {
					user: true,
				},
			});

			// 5 is the min length for a query, even though we santize user queries, we will be safe here too
			const filteredProjects = projects.filter((project) => project.query!.trim().length > 5);

			// we transform the subreddits to be lowercase before we use them
			const projectsWithSanitizedSubreddits = filteredProjects.map((project) => {
				const includedSubreddits = project.reddit_included_subreddits.map((subreddit) =>
					subreddit.toLowerCase()
				);

				const excludedSubreddits = project.reddit_excluded_subreddits.map((subreddit) =>
					subreddit.toLowerCase()
				);

				return {
					...project,
					reddit_included_subreddits: includedSubreddits,
					reddit_excluded_subreddits: excludedSubreddits,
				};
			});

			const timeStart = Date.now();
			const leads = await postSlurper.slurp();

			for (const lead of leads) {
				const groupLowerCase = lead.group.toLowerCase();

				if (blacklistedSubreddits.includes(groupLowerCase)) {
					continue;
				}

				const limit = pLimit(20);

				const searchDocument = {
					title: lead.title,
					content: lead.content,
				};

				await Promise.allSettled(
					projectsWithSanitizedSubreddits.map((project) =>
						limit(async () => {
							if (lead.is_nsfw && !project.reddit_allow_nsfw) {
								return;
							}

							if (
								project.reddit_included_subreddits.length > 0 &&
								!project.reddit_included_subreddits.includes(groupLowerCase)
							) {
								return;
							}

							if (
								project.reddit_excluded_subreddits.length > 0 &&
								project.reddit_excluded_subreddits.includes(groupLowerCase)
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

							if (!existingLead) {
								const newLead = await prisma.lead.create({
									data: {
										project_id: project.id,
										type: lead.type,
										title: lead.title,
										content: lead.content,
										date: lead.date,
										platform: lead.platform,
										username: lead.username,
										group: lead.group,
										remote_id: lead.remote_id,
										remote_user_id: lead.remote_user_id,
										remote_group_id: lead.remote_group_id,
										remote_url: lead.remote_url,
									},
								});

								if (project.webhook_url) {
									leadEngineService.addSendLeadWebhookJob(newLead.id);
								}

								// maybe check if user has replies here too
								if (
									project.reddit_replies_enabled &&
									project.user.reply_credits > 0
								) {
									leadEngineService.addProcessLeadJob(newLead.id);
								}
							}
						})
					)
				);
			}

			logger.info(
				{
					amount: leads.length,
					duration: Date.now() - timeStart,
				},
				"Finished slurping reddit posts"
			);
		} catch (err) {
			logger.error(err, "Failed slurping reddit posts");
		}

		isRunning = false;
	},
});
