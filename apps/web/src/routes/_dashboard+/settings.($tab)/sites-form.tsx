import { IconReddit } from "@/components/icons/reddit";
import { useCurrentProjectQuery } from "@/features/projects/hooks/use-current-project-query";
import { trpc } from "@/lib/trpc";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	Accordion,
	Box,
	Button,
	Group,
	Stack,
	Switch,
	Tabs,
	TagsInput,
	TextInput,
	Textarea,
} from "@mantine/core";
import { useMatches } from "@remix-run/react";
import {
	UpdateProjectInputType,
	updateProjectInputSchema,
} from "@sweetreply/shared/features/projects/schemas";
import { Controller, useForm } from "react-hook-form";

export const SitesForm = () => {
	const { data: project } = useCurrentProjectQuery();
	const updateProjectMutation = trpc.projects.update.useMutation();
	const trpcUtils = trpc.useUtils();

	const form = useForm<UpdateProjectInputType["data"]>({
		resolver: zodResolver(updateProjectInputSchema.shape.data),
		values: {
			reddit_monitor_enabled: project?.reddit_monitor_enabled ?? false,
			reddit_replies_enabled: project?.reddit_replies_enabled ?? false,
			reddit_allow_nsfw: project?.reddit_allow_nsfw ?? false,
			reddit_included_subreddits: project?.reddit_included_subreddits ?? [],
			reddit_excluded_subreddits: project?.reddit_excluded_subreddits ?? [],
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
					<Accordion defaultValue="reddit">
						<Accordion.Item value="reddit">
							<Accordion.Control>
								<Group>
									<IconReddit height={24} width={24} />
									Reddit
								</Group>
							</Accordion.Control>
							<Accordion.Panel>
								<Stack mt="lg">
									<Controller
										control={form.control}
										name="reddit_monitor_enabled"
										render={({ field }) => (
											<Switch
												label="Enable monitoring"
												description="Monitor Reddit for mentions of your project"
												checked={field.value}
												onChange={field.onChange}
											/>
										)}
									/>
									<Controller
										control={form.control}
										name="reddit_allow_nsfw"
										render={({ field }) => (
											<Switch
												label="Allow NSFW"
												description="Allows the monitor to find NSFW posts"
												checked={field.value}
												onChange={field.onChange}
											/>
										)}
									/>
									<Controller
										control={form.control}
										name="reddit_replies_enabled"
										render={({ field }) => (
											<Switch
												label="Enable replies"
												description="Automatically reply to mentions on Reddit"
												checked={field.value}
												onChange={field.onChange}
											/>
										)}
									/>
									<Controller
										name="reddit_included_subreddits"
										control={form.control}
										render={({ field, fieldState }) => (
											<TagsInput
												label="Included subreddits"
												description="Specify subreddits that you would like to be monitored. Leave blank to monitor all subreddits. Only enter the subreddit name without r/."
												clearable={true}
												error={fieldState.error?.message}
												value={field.value}
												onChange={field.onChange}
											/>
										)}
									/>
									<Controller
										name="reddit_excluded_subreddits"
										control={form.control}
										render={({ field, fieldState }) => (
											<TagsInput
												label="Excluded subreddits"
												description="Specify subreddits that you would like to be ignored. Leave blank to not exclude any subreddits. Only enter the subreddit name without r/."
												clearable={true}
												error={fieldState.error?.message}
												value={field.value}
												onChange={field.onChange}
											/>
										)}
									/>
								</Stack>
							</Accordion.Panel>
						</Accordion.Item>
					</Accordion>
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
