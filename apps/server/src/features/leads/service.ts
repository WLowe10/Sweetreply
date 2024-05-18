import { prisma } from "@lib/db";
import { ReplyStatus } from "@sweetreply/shared/features/leads/constants";
import { differenceInMilliseconds, isFuture } from "date-fns";
import { botActionQueue } from "./queues/bot-action";
import { sendLeadWebhookQueue } from "./queues/send-lead-webhook";
import { processLeadQueue } from "./queues/process-lead";

export async function userOwnsLead({ userID, leadID }: { userID: string; leadID: string }) {
	return await prisma.lead.findUnique({
		where: {
			id: leadID,
			project: {
				user_id: userID,
			},
		},
		include: {
			project: true,
		},
	});
}

export async function lock(leadId: string) {
	await prisma.lead.update({
		where: {
			id: leadId,
		},
		data: {
			reply_status: ReplyStatus.DRAFT,
			locked: true,
			reply_scheduled_at: null,
			replied_at: null,
		},
	});
}

export async function draft(leadId: string) {
	await prisma.lead.update({
		where: {
			id: leadId,
		},
		data: {
			reply_status: ReplyStatus.DRAFT,
			reply_scheduled_at: null,
			replied_at: null,
		},
	});
}

export async function countOutstandingRepliesForUser(userID: string) {
	return prisma.lead.count({
		where: {
			reply_status: ReplyStatus.SCHEDULED,
			project: {
				user: {
					id: userID,
				},
			},
		},
	});
}

export function deductReplyCreditFromUser(userID: string) {
	return prisma.user.update({
		where: {
			id: userID,
		},
		data: {
			reply_credits: {
				decrement: 1,
			},
		},
	});
}

export function addReplyJob(leadId: string, opts?: { date: Date | undefined }) {
	let delay;

	if (opts?.date && isFuture(opts.date)) {
		delay = differenceInMilliseconds(opts.date, new Date());
	}

	return botActionQueue.add({ lead_id: leadId }, { jobId: leadId, delay });
}

export function addSendLeadWebhookJob(leadId: string) {
	return sendLeadWebhookQueue.add({ lead_id: leadId }, { jobId: leadId });
}

export function addProcessLeadJob(leadId: string) {
	return processLeadQueue.add({ lead_id: leadId }, { jobId: leadId });
}

export async function cancelUserScheduledReplies(userID: string) {
	const scheduledLeads = await prisma.lead.findMany({
		where: {
			reply_status: ReplyStatus.SCHEDULED,
			project: {
				user_id: userID,
			},
		},
	});

	for (const lead of scheduledLeads) {
		const job = await botActionQueue.getJob(lead.id);

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
			reply_status: ReplyStatus.SCHEDULED,
			project: {
				user_id: userID,
			},
		},
		data: {
			reply_scheduled_at: null,
			reply_status: ReplyStatus.DRAFT,
		},
	});
}
