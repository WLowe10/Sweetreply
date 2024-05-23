import { cleanUpJob } from "./features/auth/jobs/clean-up";
import { redditLeadGenJob } from "./features/leads/jobs/reddit-lead-gen";
import { checkBansJob } from "@features/bots/jobs/check-bans";
import type { CronJob } from "cron";

const jobs: CronJob[] = [cleanUpJob, redditLeadGenJob, checkBansJob];

export function startJobs() {
	jobs.forEach((job) => job.start());
}
