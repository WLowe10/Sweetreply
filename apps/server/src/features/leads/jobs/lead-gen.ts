import { CronJob } from "cron";
import { generateLeadsQueue } from "../queues/generate-leads";

// This job runs once per hour
// It adds a job to the generateLeadsQueue
// Cron (0 * * * *) (Every hour)

export const leadGenJob = CronJob.from({
	cronTime: "0 * * * *",
	// cronTime: "* * * * *", // uncomment this to run every minute
	onTick: async () => {
		generateLeadsQueue.add({
			keywords: ["sweetreply"],
		});
	},
});
