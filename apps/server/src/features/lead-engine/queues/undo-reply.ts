import Queue from "bull";
import { env } from "@env";
import { prisma } from "@lib/db";

export type UndoReplyQueueJobData = {
	lead_id: string;
};

const replyQueue = new Queue<UndoReplyQueueJobData>("undo-reply", {
	redis: env.REDIS_URL,
	limiter: {
		max: 1,
		duration: 1000,
	},
	defaultJobOptions: {
		attempts: 3,
		removeOnComplete: true,
		removeOnFail: true,
		backoff: {
			type: "exponential",
			delay: 4000,
		},
	},
});

replyQueue.process(async (job) => {
	const jobData = job.data;

	const lead = await prisma.lead.findUnique({
		where: {
			id: jobData.lead_id,
		},
	});
});
