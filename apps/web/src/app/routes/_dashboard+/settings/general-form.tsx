import { useCurrentProjectQuery } from "@/features/projects/hooks/use-current-project";
import { trpc } from "@/lib/trpc";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Stack, Tabs, TextInput, Textarea } from "@mantine/core";
import {
	UpdateProjectInputType,
	updateProjectInputSchema,
} from "@sweetreply/shared/features/projects/schemas";
import { useForm } from "react-hook-form";

export const GeneralForm = () => {
	const { data: project } = useCurrentProjectQuery();
	const updateProjectMutation = trpc.projects.update.useMutation();
	const trpcUtils = trpc.useUtils();

	const form = useForm<UpdateProjectInputType["data"]>({
		resolver: zodResolver(updateProjectInputSchema.shape.data),
		values: {
			name: project?.name ?? "",
			description: project?.description ?? "",
			query: project?.query ?? "",
		},
	});

	const handleSubmit = form.handleSubmit((data) => {
		if (!project?.id) {
			return;
		}

		updateProjectMutation.mutate(
			{
				id: project.id,
				data,
			},
			{
				onSuccess: (updatedProject) => {
					trpcUtils.projects.get.setData({ id: updatedProject.id }, updatedProject);
					trpcUtils.projects.getMany.setData(undefined, (prev) =>
						prev
							? prev.map((p) => (p.id === updatedProject.id ? updatedProject : p))
							: [updatedProject]
					);
				},
			}
		);
	});

	return (
		<Box mt={"sm"}>
			<form onSubmit={handleSubmit}>
				<Stack>
					<TextInput
						label="Name"
						error={form.formState.errors.name?.message}
						{...form.register("name")}
					/>
					<Textarea
						label="Description"
						error={form.formState.errors.description?.message}
						{...form.register("description")}
					/>
					<Textarea
						label="Query"
						autoCorrect="false"
						autoComplete="false"
						inputWrapperOrder={["label", "input", "description", "error"]}
						error={form.formState.errors.query?.message}
						{...form.register("query")}
					/>
					<Button type="submit" loading={updateProjectMutation.isLoading}>
						Save
					</Button>
				</Stack>
			</form>
		</Box>
	);
};
