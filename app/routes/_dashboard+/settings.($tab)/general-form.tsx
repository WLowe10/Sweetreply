import { useCurrentProjectQuery } from "@/features/projects/hooks/use-current-project-query";
import { trpc } from "@/lib/trpc";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	Anchor,
	Box,
	Button,
	Stack,
	Tabs,
	TagsInput,
	Text,
	TextInput,
	Textarea,
} from "@mantine/core";
import { updateProjectInputSchema, type UpdateProjectInputType } from "~/features/projects/schemas";
import { Controller, useForm } from "react-hook-form";

export const GeneralForm = () => {
	const { data: project } = useCurrentProjectQuery();
	const updateProjectMutation = trpc.projects.update.useMutation();
	const trpcUtils = trpc.useUtils();

	const form = useForm<UpdateProjectInputType["data"]>({
		resolver: zodResolver(updateProjectInputSchema.shape.data),
		values: {
			name: project?.name ?? "",
			description: project?.description ?? "",
			website_url: project?.website_url ?? "",
			keywords: project?.keywords ?? [],
			negative_keywords: project?.negative_keywords ?? [],
		},
	});

	const handleSubmit = form.handleSubmit(data => {
		if (!project?.id) {
			return;
		}

		updateProjectMutation.mutate(
			{
				id: project.id,
				data,
			},
			{
				onSuccess: updatedProject => {
					trpcUtils.projects.get.setData({ id: updatedProject.id }, updatedProject);
					trpcUtils.projects.getMany.setData(undefined, prev =>
						prev
							? prev.map(p => (p.id === updatedProject.id ? updatedProject : p))
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
						description="Name of your product or service"
						autoCorrect="off"
						autoComplete="off"
						autoCapitalize="off"
						spellCheck="false"
						{...form.register("name")}
					/>
					<TextInput
						label="Website URL"
						error={form.formState.errors.website_url?.message}
						description="The URL of your website"
						placeholder="https://website.com"
						autoCorrect="off"
						autoComplete="off"
						autoCapitalize="off"
						spellCheck="false"
						{...form.register("website_url")}
					/>
					<Textarea
						label="Description"
						description="Describe your product or service. This will be used to generate replies."
						autoCorrect="off"
						autoComplete="off"
						autoCapitalize="off"
						spellCheck="false"
						resize="vertical"
						error={form.formState.errors.description?.message}
						{...form.register("description")}
					/>
					<Controller
						name="keywords"
						control={form.control}
						render={({ field, fieldState }) => (
							<TagsInput
								label="Keywords"
								description="Leads with any of these keywords will be detected"
								clearable={true}
								error={fieldState.error?.message}
								value={field.value}
								onChange={field.onChange}
							/>
						)}
					/>
					<Controller
						name="negative_keywords"
						control={form.control}
						render={({ field, fieldState }) => (
							<TagsInput
								label="Negative keywords"
								description="Leads with any of these keywords will be excluded"
								clearable={true}
								error={fieldState.error?.message}
								value={field.value}
								onChange={field.onChange}
							/>
						)}
					/>
					{/* <Textarea
						label="Query"
						autoCorrect="off"
						autoComplete="off"
						autoCapitalize="off"
						spellCheck="false"
						resize="vertical"
						error={form.formState.errors.query?.message}
						description={
							<Text component="span" size="xs">
								Use a query to filter the leads you want to find.{" "}
								<Anchor component={Link} to="/help/query">
									Guide
								</Anchor>
							</Text>
						}
						{...form.register("query")}
					/> */}
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
