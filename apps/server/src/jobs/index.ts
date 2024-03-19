import { deleteExpiredSessionsJob } from "./delete-expired-sessions";
import type { CronJob } from "cron";

const jobs: CronJob[] = [deleteExpiredSessionsJob];

export function startJobs() {
    for (const job of jobs) {
        job.start();
    }
}
