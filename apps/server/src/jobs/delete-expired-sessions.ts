import { CronJob } from "cron";

export const deleteExpiredSessionsJob = CronJob.from({
	// cronTime: CronTime,
	cronTime: "* * * * *",
	onTick: () => {
		console.log("Job executed");
	},
});
