import { cleanUpJob } from "./auth/jobs/clean-up";
import { leadGenJob } from "./features/leads/jobs/lead-gen";
import type { CronJob } from "cron";

const jobs: CronJob[] = [cleanUpJob];

export function startJobs() {
	jobs.forEach((job) => job.start());
}
