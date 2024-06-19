import { Button, Modal, Stack, type ModalProps } from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
import { notifications } from "@mantine/notifications";
import { zodResolver } from "@hookform/resolvers/zod";
import { formatRelative } from "date-fns";
import { IconClock, IconSend2 } from "@tabler/icons-react";
import { Controller, useForm } from "react-hook-form";
import { sendReplyInputDataSchema, type SendReplyInputDataType } from "~/features/leads/schemas";
import { getMaxFutureReplyDate } from "~/features/leads/utils";
import { trpc } from "@/lib/trpc";

export type SendReplyModalProps = {
	leadId: string;
	modalProps: ModalProps;
};

export const SendReplyModal = ({ leadId, modalProps }: SendReplyModalProps) => {
	const sendReplyMutation = trpc.leads.sendReply.useMutation();
	const trpcUtils = trpc.useUtils();

	const form = useForm<SendReplyInputDataType>({
		resolver: zodResolver(sendReplyInputDataSchema),
	});

	const date = form.watch("date");

	const onSubmit = form.handleSubmit(data => {
		sendReplyMutation.mutate(
			{
				lead_id: leadId,
				data,
			},
			{
				onSuccess: updatedLead => {
					trpcUtils.leads.get.setData({ id: updatedLead.id }, updatedLead);
					modalProps.onClose();
				},
				onError: err => {
					notifications.show({
						title: "Failed to send reply",
						message: err.message,
						color: "red",
					});
				},
			}
		);
	});

	return (
		<Modal title="Send reply" {...modalProps}>
			<form onSubmit={onSubmit}>
				<Stack>
					<Controller
						name="date"
						control={form.control}
						render={({ field, fieldState }) => (
							<DateTimePicker
								leftSection={<IconClock size={18} />}
								description="Choose a date and time to send the reply"
								placeholder="now"
								minDate={new Date()}
								maxDate={getMaxFutureReplyDate()}
								value={field.value}
								onChange={field.onChange}
								error={fieldState.error?.message}
								clearable
							/>
						)}
					/>
					<Button
						type="submit"
						fullWidth
						rightSection={<IconSend2 size={18} />}
						loading={sendReplyMutation.isLoading}
					>
						{date ? `Send ${formatRelative(date, new Date())}` : `Send`}
					</Button>
				</Stack>
			</form>
		</Modal>
	);
};
