import { useCurrentProjectQuery } from "@/features/projects/hooks/use-current-project";
import { trpc } from "@/lib/trpc";
import {
	Box,
	Button,
	Checkbox,
	Group,
	NumberInput,
	Radio,
	Stack,
	Switch,
	TextInput,
	Textarea,
} from "@mantine/core";
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

	const form = useForm<UpdateProjectInputType["data"]>({
		resolver: zodResolver(updateProjectInputSchema.shape.data),
		values: {
			replies_enabled: project?.replies_enabled ?? false,
			reply_mention_mode: (project?.reply_mention_mode as any) ?? "name",
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
					<Controller
						name="reply_mention_mode"
						control={form.control}
						render={({ field }) => (
							<Radio.Group
								label="Mention mode"
								description="Select the way you'd like to be mentioned"
								value={field.value}
								onChange={field.onChange}
							>
								<Group mt="xs">
									<Radio value="name" label="Name only (Default)" />
									<Radio value="name_or_url" label="Name or URL" />
									<Radio value="url" label="URL only" />
								</Group>
							</Radio.Group>
						)}
					/>
					<NumberInput
						label="Daily limit"
						description="Automatic replies will stop after you reach your chosen daily limit. Set to 0 for no limit."
					/>
					<Textarea
						label="Custom instructions"
						description="Use custom instructions to fine-tune how our AI generates replies. Leave blank for default behavior."
						autoCorrect="off"
						autoComplete="off"
						autoCapitalize="off"
						spellCheck="false"
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
