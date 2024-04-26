import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Modal, Stack, type ModalProps } from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
import {
	sendReplyInputDataSchema,
	type SendReplyInputDataType,
} from "@sweetreply/shared/features/leads/schemas";
import { IconClock, IconSend2 } from "@tabler/icons-react";
import { Controller, useForm } from "react-hook-form";
import { trpc } from "@/lib/trpc";
import { addDays, formatRelative } from "date-fns";
import { getMaxFutureReplyDate } from "@sweetreply/shared/features/leads/utils";

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

	const onSubmit = form.handleSubmit((data) => {
		sendReplyMutation.mutate(
			{
				lead_id: leadId,
				data,
			},
			{
				onSuccess: (updatedLead) => {
					trpcUtils.leads.get.setData({ id: updatedLead.id }, updatedLead);
					modalProps.onClose();
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
