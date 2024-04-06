import { trpc } from "@/lib/trpc";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Flex, Modal, TextInput, type ModalProps } from "@mantine/core";
import { createTeamInputSchema } from "@sweetreply/shared/schemas/teams";
import { useForm } from "react-hook-form";
import { useTeamContext } from "../hooks/use-team-context";
import { z } from "zod";

export type CreateTeamModalProps = {
	modalProps: ModalProps;
};

export const CreateTeamModal = ({ modalProps }: CreateTeamModalProps) => {
	const { setTeamId } = useTeamContext();
	const createTeamMutation = trpc.teams.create.useMutation();
	const trpcUtils = trpc.useUtils();

	const form = useForm<z.infer<typeof createTeamInputSchema>>({
		resolver: zodResolver(createTeamInputSchema),
		defaultValues: {
			name: "My Team",
		},
	});

	const onClose = () => {
		modalProps.onClose();
		form.reset();
	};

	const handleSubmit = form.handleSubmit(async (data) => {
		createTeamMutation.mutate(data, {
			onSuccess: (newTeam) => {
				trpcUtils.teams.get.setData({ id: newTeam.id }, newTeam);
				trpcUtils.teams.getMany.setData(undefined, (prev) =>
					prev ? [...prev, newTeam] : [newTeam]
				);
				setTeamId(newTeam.id);
			},
		});
	});

	return (
		<Modal title="Create Team" {...modalProps}>
			<form onSubmit={handleSubmit}>
				<TextInput
					{...form.register("name")}
					label="Team Name"
					error={form.formState.errors.name?.message}
				/>
				<Flex align="center" justify="space-between" mt="md">
					<Button variant="outline" onClick={onClose}>
						Cancel
					</Button>
					<Button type="submit" loading={createTeamMutation.isLoading}>
						Continue
					</Button>
				</Flex>
			</form>
		</Modal>
	);
};
