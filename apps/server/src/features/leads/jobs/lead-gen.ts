import { CronJob } from "cron";
import { generateLeadsQueue } from "../queues/generate-leads";
import { prisma } from "@/lib/db";

// This job runs once per hour
// It adds a job to the generateLeadsQueue
// Cron (0 * * * *) (Every hour)

export const leadGenJob = CronJob.from({
	cronTime: "0 * * * *",
	// cronTime: "* * * * *", // uncomment this to run every minute
	onTick: async () => {
		const projects = await prisma.project.findMany({});

		generateLeadsQueue.add({
			keywords: ["sweetreply"],
		});
	},
});
