import { cleanUpJob } from "./clean-up";
import { processRepliesJob } from "./process-replies";
import type { CronJob } from "cron";

const jobs: CronJob[] = [cleanUpJob, processRepliesJob];

export function startJobs() {
	jobs.forEach((job) => job.start());
}
