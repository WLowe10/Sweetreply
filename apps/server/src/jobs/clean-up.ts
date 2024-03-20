import { CronJob } from "cron";
import { authService } from "@/services/auth";

/**
 * This job will run every day at midnight to delete expired password reset codes and sessions.
 *
 * -- Every night at midnight
 */

export const cleanUpJob = CronJob.from({
	// cronTime: CronTime,
	cronTime: "0 0 * * *",
	onTick: async () => {
		await authService.deleteExpiredSessions();
		await authService.deleteExpiredPasswordResetCodes();
	},
});
