import { zodResolver } from "@hookform/resolvers/zod";
import {
	EditReplyInputType,
	editReplyInputSchema,
} from "@sweetreply/shared/features/leads/schemas";
import { useForm } from "react-hook-form";
import { useLeadContext } from "./use-lead-context";
import { useState } from "react";
import { notifications } from "@mantine/notifications";
import { trpc } from "@/lib/trpc";

export const useReplyForm = () => {
	const lead = useLeadContext();
	const [isEditing, setIsEditing] = useState<boolean>(false);
	const trpcUtils = trpc.useUtils();

	const editReplyMutation = lead.editReplyMutation;

	const form = useForm<EditReplyInputType["data"]>({
		resolver: zodResolver(editReplyInputSchema.shape.data),
		values: {
			reply_text: lead.data.reply_text || "",
		},
	});

	const onSubmit = form.handleSubmit((data) => {
		editReplyMutation.mutate(
			{
				lead_id: lead.data.id,
				data: {
					reply_text: data.reply_text,
				},
			},
			{
				onSuccess: (updatedReply) => {
					trpcUtils.leads.get.setData({ id: updatedReply.id }, updatedReply);
					notifications.show({
						title: "Reply edited",
						message: "Reply has been successfully edited",
					});
					setIsEditing(false);
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
	});

	const onEdit = () => {
		setIsEditing(true);
	};

	const onCancel = () => {
		setIsEditing(false);
		form.reset();
	};

	return {
		form,
		lead,
		isEditing,
		onSubmit,
		onEdit,
		onCancel,
	};
};
