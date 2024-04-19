import { CronJob } from "cron";
import { prisma } from "@/lib/db";
import { logger } from "@/lib/logger";
import { RedditPostSlurper } from "./post-slurper";
import { Project } from "@sweetreply/prisma";

const postSlurper = new RedditPostSlurper();

const slurpPosts = async (projects: Project[]) => {
	try {
		await postSlurper.slurp(projects);
	} catch (err) {
		logger.error(err, "Reddit slurp failed");
	}
};

// todo, job should not start if already running
export const redditLeadGenJob = CronJob.from({
	cronTime: "* * * * *",
	onTick: async () => {
		logger.info("Generating reddit leads");

		// also check if project has reddit enabled
		// also figure out best way to configure specific subreddits
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
	},
});
