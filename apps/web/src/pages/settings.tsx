import { useCurrentProjectQuery } from "@/features/projects/hooks/use-current-project";
import { DashboardLayout } from "@/layouts/dashboard";
import { ResourceLayout } from "@/layouts/resource";
import { trpc } from "@/lib/trpc";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Stack, Tabs, TagsInput, Text, TextInput, Textarea } from "@mantine/core";
import { Controller, useForm } from "react-hook-form";
import {
	updateProjectInputSchema,
	type UpdateProjectInputType,
} from "@sweetreply/shared/features/projects/schemas";

const GeneralForm = () => {
	const { data: project } = useCurrentProjectQuery();
	const updateProjectMutation = trpc.projects.update.useMutation();
	const trpcUtils = trpc.useUtils();

	const form = useForm<UpdateProjectInputType["data"]>({
		resolver: zodResolver(updateProjectInputSchema.shape.data),
		values: {
			name: project?.name ?? "",
			description: project?.description ?? "",
			keywords: project?.keywords ?? [],
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
					<Controller
						name="keywords"
						control={form.control}
						render={({ field }) => (
							<TagsInput
								label="Keywords"
								value={field.value}
								error={form.formState.errors.keywords?.message}
								onChange={field.onChange}
							/>
						)}
					/>
					<Button type="submit" loading={updateProjectMutation.isLoading}>
						Save
					</Button>
				</Stack>
			</form>
		</Box>
	);
};

const SettingsPage = () => {
	const updateProjectMutation = trpc.projects.update.useMutation();

	return (
		<ResourceLayout>
			<Tabs defaultValue="general">
				<Tabs.List>
					<Tabs.Tab value="general">General</Tabs.Tab>
					<Tabs.Tab value="reddit">Reddit</Tabs.Tab>
					<Tabs.Tab value="notifications">Notifications</Tabs.Tab>
				</Tabs.List>
				<Tabs.Panel value="general">
					<GeneralForm />
				</Tabs.Panel>
				<Tabs.Panel value="reddit">
					<div />
				</Tabs.Panel>
				<Tabs.Panel value="notifications">
					<div />
				</Tabs.Panel>
			</Tabs>
		</ResourceLayout>
	);
};

// @ts-ignore
SettingsPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default SettingsPage;
