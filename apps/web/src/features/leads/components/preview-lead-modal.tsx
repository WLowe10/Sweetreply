import { Modal, type ModalProps } from "@mantine/core";
import { trpc } from "@/lib/trpc";

export type PreviewLeadModalProps = {
	leadId: string;
	modalProps: ModalProps;
};

export const PreviewLeadModal = ({ leadId, modalProps }: PreviewLeadModalProps) => {
	const getLeadQuery = trpc.leads.get.useQuery({
		id: leadId,
	});

	return (
		<Modal title="Preview lead" {...modalProps}>
			Preview lead {leadId}
		</Modal>
	);
};
