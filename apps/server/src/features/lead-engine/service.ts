import { prisma } from "@lib/db";
import { ReplyStatus } from "@sweetreply/shared/features/leads/constants";
import { replyQueue } from "./queues/reply";

export class LeadEngineService {
	public async cancelUserScheduledReplies(userId: string) {
		const scheduledLeads = await prisma.lead.findMany({
			where: {
				reply_status: ReplyStatus.SCHEDULED,
				project: {
					user_id: userId,
				},
			},
		});

		for (const lead of scheduledLeads) {
			const job = await replyQueue.getJob(lead.id);

			if (job) {
				try {
					await job.remove();
				} catch {
					// noop
				}
			}
		}

		await prisma.lead.updateMany({
			where: {
				project: {
					user_id: userId,
				},
			},
			data: {
				reply_scheduled_at: null,
				reply_status: ReplyStatus.DRAFT,
			},
		});
	}
}

export const leadEngineService = new LeadEngineService();
