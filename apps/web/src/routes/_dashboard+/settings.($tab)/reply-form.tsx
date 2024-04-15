import { useCurrentProjectQuery } from "@/features/projects/hooks/use-current-project";
import { trpc } from "@/lib/trpc";
import { Box, Button, Checkbox, Stack, Switch, TextInput, Textarea } from "@mantine/core";
import { Controller, useForm } from "react-hook-form";
import {
	updateProjectInputSchema,
	type UpdateProjectInputType,
} from "@sweetreply/shared/features/projects/schemas";
import { zodResolver } from "@hookform/resolvers/zod";

export const ReplyForm = () => {
	const { data: project } = useCurrentProjectQuery();
	const updateProjectMutation = trpc.projects.update.useMutation();
	const trpcUtils = trpc.useUtils();

	const form = useForm<
		Pick<UpdateProjectInputType["data"], "replies_enabled" | "custom_reply_instructions">
	>({
		resolver: zodResolver(updateProjectInputSchema.shape.data),
		values: {
			replies_enabled: project?.replies_enabled ?? false,
			custom_reply_instructions: project?.custom_reply_instructions ?? "",
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
						name="replies_enabled"
						control={form.control}
						render={({ field }) => (
							<Switch
								label="Enable replies"
								description="When enabled, we will automatically reply to leads on your behalf"
								onChange={field.onChange}
								checked={field.value}
							/>
						)}
					/>

					<Switch
						label="Engagement (COMING SOON)"
						description="When enabled, our bot will like the post and follow the user after replying"
						disabled={true}
					/>
					<Textarea
						label="Custom instructions"
						description="Use custom instructions to fine-tune how our AI generates replies. Leave blank for default behavior."
						{...form.register("custom_reply_instructions")}
					/>
					<Button type="submit" disabled={!form.formState.isDirty}>
						Save
					</Button>
				</Stack>
			</form>
		</Box>
	);
};
