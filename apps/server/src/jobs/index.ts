import { CronJob } from "cron";

const deleteExpiredSessionsJob = CronJob.from({
    cronTime: "* * * * * *",
    onTick: () => {
        console.log("Job executed");
    },
});

const jobs: CronJob[] = [deleteExpiredSessionsJob];

export function startJobs() {
    // for (const job of jobs) {
    //     job.start();
    // }
}
