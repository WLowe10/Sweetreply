import { cleanUpJob } from "./clean-up";
import type { CronJob } from "cron";

const jobs: CronJob[] = [cleanUpJob];

export function startJobs() {
	for (const job of jobs) {
		job.start();
	}
}
