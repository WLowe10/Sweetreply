import { Modal, type ModalProps } from "@mantine/core";
import { CreateProjectForm } from "./create-project-form";

export type CreateTeamModalProps = {
	modalProps: ModalProps;
};

export const CreateProjectModal = ({ modalProps }: CreateTeamModalProps) => {
	return (
		<Modal title="Create Project" {...modalProps}>
			<CreateProjectForm onSuccess={modalProps.onClose} />
		</Modal>
	);
};
