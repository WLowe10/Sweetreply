import { useCurrentProjectQuery } from "@/features/projects/hooks/use-current-project-query";
import { trpc } from "@/lib/trpc";
import {
	Box,
	Button,
	Checkbox,
	Group,
	InputWrapper,
	NumberInput,
	Radio,
	Slider,
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
			reply_mention_mode: (project?.reply_mention_mode as any) ?? "name",
			reply_delay: project?.reply_delay ?? 10,
			reply_daily_limit: project?.reply_daily_limit ?? 0,
			reply_custom_instructions: project?.reply_custom_instructions ?? "",
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
					{/* <Switch
						label="Engagement (COMING SOON)"
						description="When enabled, our bot will like the post and follow the user after replying"
						disabled={true}
					/> */}
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
					<Controller
						name="reply_delay"
						control={form.control}
						render={({ field, fieldState }) => (
							<NumberInput
								label="Reply delay"
								description="The minimum amount of minutes between a lead and an automatic reply. Default is 10 minutes."
								value={field.value}
								onChange={field.onChange}
								error={fieldState.error?.message}
								allowDecimal={false}
								allowNegative={false}
							/>
						)}
					/>
					<Controller
						name="reply_daily_limit"
						control={form.control}
						render={({ field, fieldState }) => (
							<NumberInput
								label="Daily limit"
								description="Automatic replies will stop after you reach your daily limit. Set to 0 for no limit."
								allowDecimal={false}
								allowNegative={false}
								allowLeadingZeros={false}
								error={fieldState.error?.message}
								onChange={field.onChange}
								value={field.value}
							/>
						)}
					/>
					<Textarea
						label="Custom instructions"
						description="Use custom instructions to fine-tune how our AI generates replies. Leave blank for default behavior."
						autoCorrect="off"
						autoComplete="off"
						autoCapitalize="off"
						spellCheck="false"
						resize="vertical"
						error={form.formState.errors.reply_custom_instructions?.message}
						{...form.register("reply_custom_instructions")}
					/>
					<Button type="submit" disabled={!form.formState.isDirty}>
						Save
					</Button>
				</Stack>
			</form>
		</Box>
	);
};

// <InputWrapper
// 	label="Reply delay"
// 	description="The minimum amount of time between a lead and an automatic reply. Default is 10 minutes."
// 	mb="sm"
// >
{
	/* <Slider
		mt="sm"
		min={0}
		max={1440}
		label={(value) => `${value} min`}
		marks={[
			{ value: 0, label: "0 min" },
			{ value: 1440, label: "1 day" },
		]}
		value={field.value}
		onChange={field.onChange}
	/> */
}
// </InputWrapper>
