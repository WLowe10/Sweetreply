import { trpc } from "@/lib/trpc";
import { notifications } from "@mantine/notifications";
import { Lead } from "@sweetreply/prisma";
import {
	canEditReply,
	canCancelReply,
	canUndoReply,
	canSendReply,
} from "@sweetreply/shared/features/leads/utils";
import { useState } from "react";

export type UseLeadType = ReturnType<typeof useLead>;

export const useLead = (leadId: string) => {
	const getLeadQuery = trpc.leads.get.useQuery(
		{ id: leadId },
		{
			refetchInterval: (data) => (data?.reply_status === "pending" ? 2500 : false),
		}
	);

	const sendReplyMutation = trpc.leads.sendReply.useMutation();
	const editReplyMutation = trpc.leads.editReply.useMutation();
	const undoReplyMutation = trpc.leads.undoReply.useMutation();
	const cancelReplyMutation = trpc.leads.cancelReply.useMutation();

	const trpcUtils = trpc.useUtils();

	const lead = getLeadQuery.data;
	const leadCanEditReply = (lead && canEditReply(lead)) || false;
	const leadCanSendReply = (lead && canSendReply(lead)) || false;
	const leadCanUndoReply = (lead && canUndoReply(lead)) || false;
	const leadCanCancelReply = (lead && canCancelReply(lead)) || false;

	const replyDate =
		lead?.reply_status === "scheduled"
			? lead?.reply_scheduled_at!
			: lead?.reply_status === "replied"
				? lead?.replied_at!
				: null;

	const sendReply = () => {
		sendReplyMutation.mutate(
			{
				lead_id: leadId,
			},
			{
				onSuccess: (updatedReply) => {
					trpcUtils.leads.get.setData({ id: updatedReply.id }, updatedReply);
				},
				onError: (err) => {
					notifications.show({
						title: "Failed to reply",
						message: err.message,
						color: "red",
					});
				},
			}
		);
	};

	const editReply = (newReplyText: string) => {
		// should ideally wait for the mutation to complete before setting isEditing to false
		editReplyMutation.mutate(
			{ lead_id: leadId, data: { reply_text: newReplyText } },
			{
				onSuccess: (updatedLead) => {
					trpcUtils.leads.get.setData({ id: updatedLead.id }, updatedLead);
				},
				onError: (err) => {
					notifications.show({
						title: "Failed to edit reply",
						message: err.message,
						color: "red",
					});
				},
			}
		);
	};

	const undoReply = () => {
		undoReplyMutation.mutate(
			{
				lead_id: leadId,
			},
			{
				onSuccess: (updatedReply) => {
					trpcUtils.leads.get.setData({ id: updatedReply.id }, updatedReply);
				},
				onError: (err) => {
					notifications.show({
						title: "Failed to undo reply",
						message: err.message,
						color: "red",
					});
				},
			}
		);
	};

	const cancelReply = () => {
		cancelReplyMutation.mutate(
			{
				lead_id: leadId,
			},
			{
				onSuccess: (updatedReply) => {
					trpcUtils.leads.get.setData({ id: updatedReply.id }, updatedReply);
				},
				onError: (err) => {
					notifications.show({
						title: "Failed to cancel reply",
						message: err.message,
						color: "red",
					});
				},
			}
		);
	};

	return {
		data: lead,
		replyDate,
		canSendReply: leadCanSendReply,
		canUpdateReply: leadCanEditReply,
		canUndoReply: leadCanUndoReply,
		canCancelReply: leadCanCancelReply,
		sendReply,
		editReply,
		undoReply,
		cancelReply,
		sendReplyMutation,
		editReplyMutation,
		cancelReplyMutation,
		undoReplyMutation,
	};
};
