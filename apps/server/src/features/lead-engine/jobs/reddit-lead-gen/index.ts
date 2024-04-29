import pLimit from "p-limit";
import { CronJob } from "cron";
import { prisma } from "@lib/db";
import { logger } from "@lib/logger";
import { RedditPostSlurper } from "./post-slurper";
import { Project } from "@sweetreply/prisma";
import { parse, test } from "liqe";
import { RedditCommentSlurper } from "./comment-slurper";
import { addProcessLeadJob } from "../../utils/add-process-lead-job";
import { addSendLeadWebhookJob } from "../../utils/add-send-lead-webhook-job";

const postSlurper = new RedditPostSlurper();
const commentSlurper = new RedditCommentSlurper();

const executeSlurper = async (
	slurper: RedditPostSlurper | RedditCommentSlurper,
	projects: Project[]
) => {
	const leads = await slurper.slurp();

	for (const lead of leads) {
		const searchDocument = postSlurper.getSearchDocument(lead);
		const limit = pLimit(20);

		await Promise.allSettled(
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

						addSendLeadWebhookJob(newLead.id);
						addProcessLeadJob(newLead.id);
					}
				})
			)
		);
	}

	return leads;
};

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
			});

			const slurpPosts = async () => {
				try {
					const timeStart = Date.now();
					const leads = await executeSlurper(postSlurper, projects);

					logger.info(
						`Slurped ${leads.length} reddit posts in ${Date.now() - timeStart}ms`
					);
				} catch (err) {
					logger.error(err, "Reddit post slurp failed");
				}
			};

			const slurpComments = async () => {
				try {
					const timeStart = Date.now();
					const leads = await executeSlurper(commentSlurper, projects);

					logger.info(
						`Slurped ${leads.length} reddit comments in ${Date.now() - timeStart}ms`
					);
				} catch (err) {
					logger.error(err, "Reddit comment slurp failed");
				}
			};

			// comments slurping is disabled for now due to the possibility of an infinite loop of bot replies,
			// since the bot replies will be picked up by the comment slurper
			await Promise.allSettled([slurpPosts()]);
		} catch (err) {
			logger.error(err, "Reddit lead gen job failed");
		}

		isRunning = false;
	},
});
