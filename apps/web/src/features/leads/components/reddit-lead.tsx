import {
	Anchor,
	Avatar,
	Card,
	Group,
	Stack,
	Text,
	Title,
	Spoiler,
	Flex,
	Menu,
	ActionIcon,
	MenuLabel,
	Badge,
	Textarea,
	Button,
	ButtonGroup,
	Divider,
} from "@mantine/core";
import { IconDots } from "@tabler/icons-react";
import { RelativeDate } from "@/components/relative-date";
import { useLeadContext } from "../hooks/use-lead-context";
import { useReplyForm } from "../hooks/use-reply-form";
import { replyStatus } from "@sweetreply/shared/features/leads/constants";

export const RedditLead = () => {
	const lead = useLeadContext();
	const { form, isEditing, onEdit, onCancel, onSubmit } = useReplyForm();

	return (
		<Stack>
			<Card>
				<Stack>
					<Flex justify="space-between">
						<Group align="center">
							<Avatar size="md" />
							<div>
								<Text size="sm">
									<Anchor
										href={`https://reddit.com/r/${lead.data.channel}`}
										target="_blank"
										c="gray"
									>{`r/${lead.data.channel}`}</Anchor>{" "}
									<Text component="span" c="dimmed">
										• <RelativeDate date={lead.data.date} />
									</Text>
								</Text>
								<Anchor
									href={`https://reddit.com/user/${lead.data.username}`}
									target="_blank"
									size="sm"
									c="gray"
								>
									{lead.data.username}
								</Anchor>
							</div>
						</Group>
						<Menu withArrow>
							<Menu.Target>
								<ActionIcon variant="subtle" color="gray">
									<IconDots size={18} />
								</ActionIcon>
							</Menu.Target>
							<Menu.Dropdown>
								<Menu.Label>Lead actions</Menu.Label>
								<Menu.Item
									component="a"
									target="_blank"
									href={lead.data.remote_url!}
								>
									View on Reddit
								</Menu.Item>
							</Menu.Dropdown>
						</Menu>
					</Flex>
					<Stack>
						<Title order={4}>{lead.data.title}</Title>
						<Spoiler maxHeight={120} showLabel="Show more" hideLabel="hide">
							{lead.data.content}
						</Spoiler>
					</Stack>
				</Stack>
			</Card>
			<Card ml="6rem">
				<Stack>
					<Flex justify="space-between">
						<Group align="center">
							<Avatar size="md">🍭</Avatar>
							<Text component="span" size="sm">
								Sweetreply
								{lead.replyDate && (
									<>
										{" "}
										•{" "}
										{lead.data.reply_status === replyStatus.SCHEDULED && (
											<Text component="span" c="dimmed">
												scheduled for{" "}
											</Text>
										)}
										<RelativeDate c="dimmed" date={lead.replyDate} />
									</>
								)}
							</Text>
						</Group>
						<Menu>
							<Menu.Target>
								<ActionIcon variant="subtle" color="gray">
									<IconDots size={18} />
								</ActionIcon>
							</Menu.Target>
							<Menu.Dropdown>
								<Menu.Label>Reply actions</Menu.Label>
								{lead.canSendReply && (
									<Menu.Item onClick={lead.sendReply}>Send reply</Menu.Item>
								)}
								{lead.canUpdateReply && (
									<Menu.Item onClick={onEdit}>Edit reply</Menu.Item>
								)}
								{lead.canUndoReply && (
									<Menu.Item onClick={lead.undoReply}>Undo reply</Menu.Item>
								)}
								{lead.canCancelReply && (
									<Menu.Item onClick={lead.cancelReply}>Cancel reply</Menu.Item>
								)}
							</Menu.Dropdown>
						</Menu>
					</Flex>
					{isEditing ? (
						<form onSubmit={onSubmit}>
							<Stack>
								<Textarea
									autosize={true}
									error={form.formState.errors.reply_text?.message}
									{...form.register("reply_text")}
								/>
								<ButtonGroup>
									<Button variant="subtle" color="gray" onClick={onCancel}>
										Cancel
									</Button>
									<Button
										type="submit"
										disabled={!form.formState.isDirty}
										loading={lead.editReplyMutation.isLoading}
									>
										Save
									</Button>
								</ButtonGroup>
							</Stack>
						</form>
					) : lead.data.reply_text ? (
						<Spoiler maxHeight={120} showLabel="Show more" hideLabel="hide">
							{lead.data.reply_text}
						</Spoiler>
					) : (
						<Text c="dimmed" fw="bold">
							No reply yet
						</Text>
					)}
					<Divider />
					{lead.data.reply_status && <Badge size="sm">{lead.data.reply_status}</Badge>}
				</Stack>
			</Card>
		</Stack>
	);
};
