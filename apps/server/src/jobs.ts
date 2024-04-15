import { cleanUpJob } from "./auth/jobs/clean-up";
import { redditLeadGenJob } from "./features/leads/jobs/reddit-lead-gen";
import type { CronJob } from "cron";

const jobs: CronJob[] = [cleanUpJob, redditLeadGenJob];

export function startJobs() {
	jobs.forEach((job) => job.start());
}
