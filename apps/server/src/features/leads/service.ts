import { prisma } from "@lib/db";
import { Lead } from "@sweetreply/prisma";
import { ReplyStatus } from "@sweetreply/shared/features/leads/constants";

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
			locked: true,
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
