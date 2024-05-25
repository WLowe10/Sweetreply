import { prisma } from "@lib/prisma";
import { ReplyStatus } from "@sweetreply/shared/features/leads/constants";
import { differenceInMilliseconds, isFuture } from "date-fns";
import { botActionQueue } from "./queues/bot-action";
import { sendLeadWebhookQueue } from "./queues/send-lead-webhook";
import { processLeadQueue } from "./queues/process-lead";
import { BotActionType } from "./constants";
import { BotError, type ReplyResultData } from "@sweetreply/bots";
import * as botsService from "@features/bots/service";
import type { Lead, User } from "@sweetreply/prisma";

export async function getLead(leadID: string) {
	return prisma.lead.findUnique({
		where: {
			id: leadID,
		},
	});
}

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

export async function lock(leadId: string): Promise<Lead> {
	return await prisma.lead.update({
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

export async function draft(leadId: string): Promise<Lead> {
	return await prisma.lead.update({
		where: {
			id: leadId,
		},
		data: {
			reply_status: ReplyStatus.DRAFT,
			reply_scheduled_at: null,
			replied_at: null,
			reply_bot_id: null,
			reply_remote_id: null,
			reply_remote_url: null,
		},
	});
}

export async function countOutstandingRepliesForUser(userID: string): Promise<number> {
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

export function deductReplyCreditFromUser(userID: string): Promise<User> {
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

export async function reply(leadID: string): Promise<void> {
	const lead = await prisma.lead.findUnique({
		where: {
			id: leadID,
		},
		include: {
			project: {
				include: {
					user: true,
				},
			},
		},
	});

	if (!lead) {
		return;
	}

	const project = lead.project;
	const user = project.user;

	if (lead.reply_status === ReplyStatus.REPLIED) {
		return;
	}

	if (user.reply_credits <= 0 || !lead.reply_text?.trim()) {
		await draft(lead.id);

		return;
	}

	// the bot service cycles through each bot
	const botAccount = await botsService.dequeueBot(lead.platform);

	// --- Automation ----

	let replyResult: ReplyResultData | undefined;
	let shouldLock = false;

	await botsService.executeBot(botAccount, async (bot) => {
		try {
			replyResult = await bot.reply(lead as any);
		} catch (err) {
			if (err instanceof BotError && err.code === "REPLY_LOCKED") {
				shouldLock = true;
			} else {
				throw err;
			}
		}
	});

	if (shouldLock) {
		await lock(lead.id);

		return;
	}

	if (!replyResult) {
		throw new Error("Failed to reply");
	}

	await prisma.lead.update({
		where: {
			id: lead.id,
		},
		data: {
			reply_status: ReplyStatus.REPLIED,
			replied_at: new Date(),
			reply_bot_id: botAccount.id,
			reply_remote_id: replyResult.reply_remote_id,
			reply_remote_url: replyResult.reply_remote_url,
			reply_scheduled_at: null,
		},
	});

	try {
		// deduct the reply credit from the user
		await deductReplyCreditFromUser(user.id);
	} catch {
		// noop, we won't redo a reply just because the deduction fails for some reason
	}
}

export async function removeReply(leadID: string): Promise<void> {
	const lead = await getLead(leadID);

	if (!lead) {
		return;
	}

	if (!lead.reply_bot_id || !lead.reply_remote_id) {
		await draft(lead.id);

		return;
	}

	const botAccount = await botsService.getBot(lead.reply_bot_id);

	// ? consider whether the removal should happen if the bot account is not active
	if (!botAccount) {
		throw new Error("Bot account not found");
	}

	await botsService.executeBot(botAccount, async (bot) => {
		await bot.deleteReply(lead);
	});

	// draft the lead
	await draft(lead.id);
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

export function addBotActionJob(
	leadId: string,
	action: BotActionType,
	opts?: { date: Date | undefined }
) {
	let delay;

	if (opts?.date && isFuture(opts.date)) {
		delay = differenceInMilliseconds(opts.date, new Date());
	}

	return botActionQueue.add({ lead_id: leadId, action }, { jobId: leadId, delay });
}

export function addSendLeadWebhookJob(leadId: string) {
	return sendLeadWebhookQueue.add({ lead_id: leadId }, { jobId: leadId });
}

export function addProcessLeadJob(leadId: string) {
	return processLeadQueue.add({ lead_id: leadId }, { jobId: leadId });
}
