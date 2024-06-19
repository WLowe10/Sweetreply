import pLimit from "p-limit";
import { CronJob } from "cron";
import { prisma } from "@lib/prisma";
import { logger } from "@lib/logger";
import { RedditPostsSlurper } from "./slurpers/posts";
import { testKeywords } from "@utils";
import * as leadsService from "../../service";

// comments slurping is disabled for now due to the possibility of an infinite loop of bot replies,
// since the bot replies will be picked up by the comment slurper

const postsSlurper = new RedditPostsSlurper();

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
					keywords: {
						isEmpty: false,
					},
				},
				include: {
					user: true,
				},
			});

			const normalizedProjects = projects.map((project) => {
				const normalizedKeywords = project.keywords.map((keyword) => keyword.toLowerCase());

				const normalizedNegativeKeywords = project.negative_keywords.map((keyword) =>
					keyword.toLowerCase()
				);

				const normalizedIncludedSubreddits = project.reddit_included_subreddits.map(
					(subreddit) => subreddit.toLowerCase()
				);

				const normalizedExcludedSubreddits = project.reddit_excluded_subreddits.map(
					(subreddit) => subreddit.toLowerCase()
				);

				return {
					...project,
					keywords: normalizedKeywords,
					negative_keywords: normalizedNegativeKeywords,
					reddit_included_subreddits: normalizedIncludedSubreddits,
					reddit_excluded_subreddits: normalizedExcludedSubreddits,
				};
			});

			const timeStart = Date.now();
			const leads = await postsSlurper.slurp();

			for (const lead of leads) {
				const groupLowerCase = lead.group.toLowerCase();

				if (blacklistedSubreddits.includes(groupLowerCase)) {
					continue;
				}

				const normalizedLeadTitle = lead.title.toLowerCase();
				const normalizedLeadContent = lead.content.toLowerCase();

				const limit = pLimit(20);

				await Promise.allSettled(
					normalizedProjects.map((project) =>
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

							const keywords = {
								keywords: project.keywords,
								negativeKeywords: project.negative_keywords,
							};

							const isMatch =
								testKeywords(normalizedLeadTitle, keywords) ||
								testKeywords(normalizedLeadContent, keywords);

							if (!isMatch) {
								return;
							}

							// this prevents the same lead being picked up twice, or a reddit user cross posting between multiple subreddits
							const existingLead = await prisma.lead.findFirst({
								where: {
									project_id: project.id,
									OR: [
										{
											remote_id: lead.remote_id,
										},
										{
											content: lead.content,
										},
									],
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
									leadsService.addSendLeadWebhookJob(newLead.id);
								}

								if (
									project.reddit_replies_enabled &&
									project.user.reply_credits > 0
								) {
									leadsService.addProcessLeadJob(newLead.id);
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
