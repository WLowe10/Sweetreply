import { CronJob } from "cron";
import { deleteExpiredSessions } from "../service";
import { logger } from "@lib/logger";

/**
 * This job will run every day at midnight to delete expired sessions.
 *
 * -- Every night at midnight
 */

export const cleanUpJob = CronJob.from({
	cronTime: "0 0 * * *",
	onTick: async () => {
		logger.info("Running auth clean up job");

		await deleteExpiredSessions();
	},
});
