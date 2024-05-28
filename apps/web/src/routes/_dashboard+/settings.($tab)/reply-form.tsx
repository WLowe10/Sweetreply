import { useCurrentProjectQuery } from "@features/projects/hooks/use-current-project-query";
import { trpc } from "@lib/trpc";
import {
	Anchor,
	Box,
	Button,
	Checkbox,
	Group,
	InputWrapper,
	NumberInput,
	Radio,
	Select,
	Slider,
	Stack,
	Switch,
	Text,
	TextInput,
	Textarea,
} from "@mantine/core";
import { Controller, useForm } from "react-hook-form";
import {
	updateProjectInputSchema,
	type UpdateProjectInputType,
} from "@sweetreply/shared/features/projects/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "@remix-run/react";

export const ReplyForm = () => {
	const { data: project } = useCurrentProjectQuery();
	const updateProjectMutation = trpc.projects.update.useMutation();
	const trpcUtils = trpc.useUtils();

	const form = useForm<UpdateProjectInputType["data"]>({
		resolver: zodResolver(updateProjectInputSchema.shape.data),
		values: {
			reply_mention_mode: (project?.reply_mention_mode as any) ?? "name",
			reply_with_domain: project?.reply_with_domain ?? true,
			reply_delay: (project?.reply_delay as unknown as any) ?? null,
			reply_daily_limit: project?.reply_daily_limit ?? 0,
			reply_custom_instructions: project?.reply_custom_instructions ?? "",
		},
	});

	const mentionMode = form.watch("reply_mention_mode");
	const URLModeEnabled = mentionMode === "name_or_url" || mentionMode === "url";

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
						name="reply_mention_mode"
						control={form.control}
						render={({ field }) => (
							<Radio.Group
								label="Mention mode"
								description="Select the way you'd like your product to be mentioned"
								value={field.value}
								onChange={field.onChange}
							>
								<Group mt="xs">
									<Radio value="name" label="Name only (Recommended)" />
									<Radio value="name_or_url" label="Name or URL" />
									<Radio value="url" label="URL only" />
								</Group>
							</Radio.Group>
						)}
					/>
					<Controller
						name="reply_with_domain"
						control={form.control}
						render={({ field }) => (
							<Checkbox
								disabled={!URLModeEnabled}
								label="Use domain"
								description="Use your website domain in the mention instead of the full URL"
								checked={field.value}
								onChange={field.onChange}
							/>
						)}
					/>
					<Controller
						name="reply_delay"
						control={form.control}
						render={({ field, fieldState }) => (
							<Select
								label="Reply delay"
								clearable={true}
								description={
									<>
										The minimum amount of time between a lead and an auto reply.{" "}
										<Anchor
											component={Link}
											size="xs"
											to="/help/get-started#reply-delay"
										>
											Learn more
										</Anchor>
									</>
								}
								data={[
									{
										value: "auto",
										label: "auto (recommended)",
									},
									{
										value: "1",
										label: "1 hour",
									},
									{
										value: "2",
										label: "2 hours",
									},
									{
										value: "4",
										label: "4 hours",
									},
									{
										value: "8",
										label: "8 hours",
									},
									{
										value: "12",
										label: "12 hours",
									},
									{
										value: "16",
										label: "16 hours",
									},
									{
										value: "20",
										label: "20 hours",
									},
									{
										value: "24",
										label: "24 hours (1 day)",
									},
									{
										value: "48",
										label: "48 hours (2 days)",
									},
								]}
								value={field.value === null ? "auto" : String(field.value)}
								onChange={(val) =>
									field.onChange(val === "auto" ? null : Number(val))
								}
							/>
							// <NumberInput
							// 	label="Reply delay"
							// 	description="The minimum amount of minutes between a lead and an auto reply. Default is 480 minutes (8 hours)."
							// 	value={field.value}
							// 	onChange={field.onChange}
							// 	error={fieldState.error?.message}
							// 	allowDecimal={false}
							// 	allowNegative={false}
							// />
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
