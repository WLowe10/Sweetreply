import pLimit from "p-limit";
import { CronJob } from "cron";
import { prisma } from "@/lib/db";
import { logger } from "@/lib/logger";
import { RedditPostSlurper } from "./post-slurper";
import { Project } from "@sweetreply/prisma";
import { parse, test } from "liqe";
import { processLeadQueue } from "../../queues/process-lead";
import { RedditCommentSlurper } from "./comment-slurper";

const postSlurper = new RedditPostSlurper();
// const commentSlurper = new RedditCommentSlurper();

// const slurp = (slurper: RedditPostSlurper | RedditCommentSlurper) => {
// 	try {}
// };

const slurpPosts = async (projects: Project[]) => {
	try {
		const timeStart = Date.now();
		const leads = await postSlurper.slurp();

		for (const lead of leads) {
			const searchDocument = postSlurper.getSearchDocument(lead);
			const limit = pLimit(20);

			await Promise.all(
				projects.map((project) =>
					limit(async () => {
						if (!project.reddit_allow_nsfw && lead.is_nsfw) {
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
									channel: lead.channel,
									remote_id: lead.remote_id,
									remote_user_id: lead.remote_user_id,
									remote_channel_id: lead.remote_channel_id,
									remote_url: lead.remote_url,
								},
							});

							// processLeadQueue.add({
							// 	lead_id: newLead.id,
							// });
						}
					})
				)
			);
		}

		logger.info(`Slurped ${leads.length} reddit posts in ${Date.now() - timeStart}ms`);
	} catch (err) {
		logger.error(err, "Reddit post slurp failed");
	}
};

// todo, job should not start if already running
export const redditLeadGenJob = CronJob.from({
	cronTime: "* * * * *",
	onTick: async () => {
		try {
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

			await Promise.allSettled([slurpPosts(projects)]);
		} catch (err) {
			logger.error(err, "Reddit lead gen job failed");
		}
	},
});
