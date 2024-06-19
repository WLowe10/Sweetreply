import { TextInput, Button, Textarea, Stack } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createProjectInputSchema, type CreateProjectInputType } from "~/features/projects/schemas";
import { useLocalProject } from "../hooks/use-local-project";
import { trpc } from "@/lib/trpc";

export type CreateProjectFormProps = {
	onSuccess?: () => void;
};

export const CreateProjectForm = (props: CreateProjectFormProps) => {
	const [id, setId] = useLocalProject();
	const createTeamMutation = trpc.projects.create.useMutation();
	const trpcUtils = trpc.useUtils();

	const form = useForm<CreateProjectInputType>({
		resolver: zodResolver(createProjectInputSchema),
		defaultValues: {
			name: "My Project",
		},
	});

	const onSubmit = form.handleSubmit(async data => {
		createTeamMutation.mutate(data, {
			onSuccess: newTeam => {
				trpcUtils.projects.get.setData({ id: newTeam.id }, newTeam);
				trpcUtils.projects.getMany.setData(undefined, prev =>
					prev ? [...prev, newTeam] : [newTeam]
				);

				setId(newTeam.id);

				notifications.show({
					message: "Created new project",
				});

				if (typeof props.onSuccess === "function") {
					props.onSuccess();
				}
			},
			onError: err => {
				notifications.show({
					title: "Failed to create project",
					message: err.message,
					color: "red",
				});
			},
		});
	});

	return (
		<form onSubmit={onSubmit}>
			<Stack>
				<TextInput
					{...form.register("name")}
					label="Project Name"
					error={form.formState.errors.name?.message}
				/>
				<TextInput
					label="Website URL"
					description="The URL of your product"
					error={form.formState.errors.website_url?.message}
					{...form.register("website_url")}
				/>
				<Textarea
					label="Description"
					description="Tell us about your product"
					error={form.formState.errors.description?.message}
					{...form.register("description")}
				/>
				<Button type="submit" loading={createTeamMutation.isLoading}>
					Create project
				</Button>
			</Stack>
		</form>
	);
};
