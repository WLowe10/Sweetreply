import { CronJob } from "cron";
import { authService } from "@/services/auth";

/**
 * This job will run every day at midnight to delete expired sessions.
 *
 * -- Every night at midnight
 */

export const cleanUpJob = CronJob.from({
	cronTime: "0 0 * * *",
	onTick: async () => {
		await authService.deleteExpiredSessions();
	},
});
