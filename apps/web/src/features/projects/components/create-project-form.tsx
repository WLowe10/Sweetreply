import { zodResolver } from "@hookform/resolvers/zod";
import { TextInput, Flex, Button } from "@mantine/core";
import {
	CreateProjectInputType,
	createProjectInputSchema,
} from "@sweetreply/shared/features/projects/schemas";
import { useForm } from "react-hook-form";
import { trpc } from "@lib/trpc";
import { useLocalProject } from "../hooks/use-local-project";

export const CreateProjectForm = () => {
	const [id, setId] = useLocalProject();
	const createTeamMutation = trpc.projects.create.useMutation();
	const trpcUtils = trpc.useUtils();

	const form = useForm<CreateProjectInputType>({
		resolver: zodResolver(createProjectInputSchema),
		defaultValues: {
			name: "My Project",
		},
	});

	const handleSubmit = form.handleSubmit(async (data) => {
		createTeamMutation.mutate(data, {
			onSuccess: (newTeam) => {
				trpcUtils.projects.get.setData({ id: newTeam.id }, newTeam);
				trpcUtils.projects.getMany.setData(undefined, (prev) =>
					prev ? [...prev, newTeam] : [newTeam]
				);
				setId(newTeam.id);
			},
		});
	});

	return (
		<form onSubmit={handleSubmit}>
			<TextInput
				{...form.register("name")}
				label="Project Name"
				error={form.formState.errors.name?.message}
			/>
			<Flex align="center" justify="space-between" mt="md">
				<Button type="submit" loading={createTeamMutation.isLoading}>
					Create project
				</Button>
			</Flex>
		</form>
	);
};
