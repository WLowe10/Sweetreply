import { trpc } from "@/lib/trpc";
import { notifications } from "@mantine/notifications";
import { Lead } from "@sweetreply/prisma";
import { canReply, canDeleteReply, canEditReply } from "@sweetreply/shared/features/leads/utils";

export type UseLeadType = ReturnType<typeof useLead>;

export const useLead = (leadId: string) => {
	const getLeadQuery = trpc.leads.get.useQuery(
		{ id: leadId },
		{
			refetchInterval: (data) => (data?.reply_status === "pending" ? 2500 : false),
		}
	);

	const replyMutation = trpc.leads.reply.useMutation();
	const editReplyMutation = trpc.leads.editReply.useMutation();
	const deleteReplyMutation = trpc.leads.deleteReply.useMutation();

	const trpcUtils = trpc.useUtils();

	const lead = getLeadQuery.data;
	const leadCanUpdateReply = (lead && canEditReply(lead)) || false;
	const leadCanReply = (lead && canReply(lead)) || false;
	const leadCanDeleteReply = (lead && canDeleteReply(lead)) || false;

	const reply = () => {
		replyMutation.mutate(
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

	const updateReply = (newReply: string) => {
		editReplyMutation.mutate(
			{ lead_id: leadId, data: { reply_text: newReply } },
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

	const deleteReply = () => {
		deleteReplyMutation.mutate(
			{
				lead_id: leadId,
			},
			{
				onSuccess: (updatedReply) => {
					trpcUtils.leads.get.setData({ id: updatedReply.id }, updatedReply);
				},
				onError: (err) => {
					notifications.show({
						title: "Failed to delete reply",
						message: err.message,
						color: "red",
					});
				},
			}
		);
	};

	return {
		data: lead,
		canReply: leadCanReply,
		canUpdateReply: leadCanUpdateReply,
		canDeleteReply: leadCanDeleteReply,
		reply,
		updateReply,
		deleteReply,
	};
};
