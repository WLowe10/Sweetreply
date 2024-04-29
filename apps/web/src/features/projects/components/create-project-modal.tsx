import { trpc } from "@lib/trpc";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Flex, Group, Modal, Stack, TextInput, type ModalProps } from "@mantine/core";
import { useForm } from "react-hook-form";
import { useLocalProject } from "../hooks/use-local-project";
import {
	createProjectInputSchema,
	type CreateProjectInputType,
} from "@sweetreply/shared/features/projects/schemas";

export type CreateTeamModalProps = {
	modalProps: ModalProps;
};

export const CreateProjectModal = ({ modalProps }: CreateTeamModalProps) => {
	const [id, setId] = useLocalProject();
	const createTeamMutation = trpc.projects.create.useMutation();
	const trpcUtils = trpc.useUtils();

	const form = useForm<CreateProjectInputType>({
		resolver: zodResolver(createProjectInputSchema),
		defaultValues: {
			name: "My Project",
		},
	});

	const onClose = () => {
		modalProps.onClose();
		form.reset();
	};

	const handleSubmit = form.handleSubmit(async (data) => {
		createTeamMutation.mutate(data, {
			onSuccess: (newTeam) => {
				trpcUtils.projects.get.setData({ id: newTeam.id }, newTeam);
				trpcUtils.projects.getMany.setData(undefined, (prev) =>
					prev ? [...prev, newTeam] : [newTeam]
				);

				setId(newTeam.id);

				modalProps.onClose();
			},
		});
	});

	return (
		<Modal title="Create Project" {...modalProps}>
			<form onSubmit={handleSubmit}>
				<Stack>
					<TextInput
						{...form.register("name")}
						label="Project Name"
						error={form.formState.errors.name?.message}
					/>
					<Flex justify="flex-end">
						<Group>
							<Button variant="subtle" color="gray" onClick={onClose}>
								Cancel
							</Button>
							<Button type="submit" loading={createTeamMutation.isLoading}>
								Continue
							</Button>
						</Group>
					</Flex>
				</Stack>
			</form>
		</Modal>
	);
};
