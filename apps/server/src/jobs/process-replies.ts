import { CronJob } from "cron";

export const processRepliesJob = new CronJob("0 * * * *", async () => {});
