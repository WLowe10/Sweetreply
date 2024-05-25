import Queue from "bull";
import * as leadsService from "@features/leads/service";
import { logger } from "@lib/logger";
import { prisma } from "@lib/prisma";
import { env } from "@env";
import { ReplyStatus } from "@sweetreply/shared/features/leads/constants";
import { BotAction, BotActionType } from "../constants";

export type BotActionQueueJobData = {
	lead_id: string;
	action: BotActionType;
};

export const botActionQueue = new Queue<BotActionQueueJobData>("bot-action", {
	redis: env.REDIS_URL,
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

botActionQueue.process(1, async (job) => {
	const leadID = job.data.lead_id;
	const action = job.data.action;

	switch (action) {
		case BotAction.REPLY:
			await leadsService.reply(leadID);
			break;

		case BotAction.REMOVE_REPLY:
			await leadsService.removeReply(leadID);
			break;
	}
});

botActionQueue.on("active", async (job) => {
	const leadID = job.data.lead_id;
	const action = job.data.action;

	logger.info(job.data, "Bot action began");

	if (action === BotAction.REPLY) {
		try {
			// mark lead as pending (the reply is being sent)
			await prisma.lead.update({
				where: {
					id: leadID,
				},
				data: {
					reply_status: ReplyStatus.PENDING,
				},
			});
		} catch {
			// noop
		}
	}
});

botActionQueue.on("completed", async (job) => {
	const jobData = job.data;

	logger.info(jobData, "Bot action completed");
});

botActionQueue.on("failed", async (job, err) => {
	const jobData = job.data;

	logger.error(
		{
			...jobData,
			attempt: job.attemptsMade,
			err,
		},
		`Bot action failed`
	);

	if (job.attemptsMade === job.opts.attempts) {
		try {
			if (jobData.action === BotAction.REPLY) {
				await prisma.lead.update({
					where: {
						id: jobData.lead_id,
					},
					data: {
						reply_status: ReplyStatus.FAILED,
						replied_at: null,
						reply_scheduled_at: null,
					},
				});
			} else if (jobData.action === BotAction.REMOVE_REPLY) {
				await prisma.lead.update({
					where: {
						id: jobData.lead_id,
					},
					data: {
						reply_status: ReplyStatus.REPLIED,
					},
				});
			}
		} catch {}
	}
});
