import { CronJob } from "cron";
import { authService } from "../service";
import { logger } from "@lib/logger";

/**
 * This job will run every day at midnight to delete expired sessions.
 *
 * -- Every night at midnight
 */

export const cleanUpJob = CronJob.from({
	cronTime: "0 0 * * *",
	onTick: async () => {
		logger.info("Running clean up job");

		await authService.deleteExpiredSessions();
	},
});
