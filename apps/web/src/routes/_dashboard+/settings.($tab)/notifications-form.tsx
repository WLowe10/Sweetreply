import { useCurrentProjectQuery } from "@/features/projects/hooks/use-current-project";
import { trpc } from "@/lib/trpc";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Stack, Tabs, TextInput, Textarea } from "@mantine/core";
import {
	UpdateProjectInputType,
	updateProjectInputSchema,
} from "@sweetreply/shared/features/projects/schemas";
import { useForm } from "react-hook-form";

export const NotificationsForm = () => {
	const { data: project } = useCurrentProjectQuery();
	const updateProjectMutation = trpc.projects.update.useMutation();
	const trpcUtils = trpc.useUtils();

	const form = useForm<UpdateProjectInputType["data"]>({
		resolver: zodResolver(updateProjectInputSchema.shape.data),
		values: {
			webhook_url: project?.webhook_url ?? "",
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
						label="Webhook"
						error={form.formState.errors.webhook_url?.message}
						description="The URL to send notifications to."
						{...form.register("webhook_url")}
					/>
					<Button
						type="submit"
						disabled={!form.formState.isDirty}
						loading={updateProjectMutation.isLoading}
					>
						Save
					</Button>
				</Stack>
			</form>
		</Box>
	);
};
