import { useCurrentProjectQuery } from "@features/projects/hooks/use-current-project-query";
import { trpc } from "@lib/trpc";
import { zodResolver } from "@hookform/resolvers/zod";
import { Anchor, Box, Button, Stack, Tabs, Text, TextInput, Textarea } from "@mantine/core";
import {
	UpdateProjectInputType,
	updateProjectInputSchema,
} from "@sweetreply/shared/features/projects/schemas";
import { IconX } from "@tabler/icons-react";
import { Controller, useForm } from "react-hook-form";
import { Link } from "@remix-run/react";

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
					<Controller
						name="webhook_url"
						control={form.control}
						render={({ field, fieldState }) => (
							<TextInput
								label="Webhook"
								description="Webhooks allow you to receive HTTP POST requests to a URL whenever we find a new lead"
								value={field.value ?? ""}
								onChange={field.onChange}
								error={fieldState.error?.message}
								rightSection={
									field.value ? (
										<IconX
											size={18}
											style={{
												display: "block",
												opacity: 0.5,
												cursor: "pointer",
											}}
											onClick={() => field.onChange(null)}
										/>
									) : null
								}
							/>
						)}
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
