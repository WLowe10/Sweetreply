import { cleanUpJob } from "./auth/jobs/clean-up";
import { redditLeadGenJob } from "./features/leads/jobs/reddit-lead-gen";
import type { CronJob } from "cron";

// redditLeadGenJob is disabled currently, should be enabled in prod of course
const jobs: CronJob[] = [cleanUpJob];

export function startJobs() {
	jobs.forEach((job) => job.start());
}
