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
	Badge,
	Textarea,
	Button,
	ButtonGroup,
	Divider,
	Tooltip,
	Center,
	Skeleton,
} from "@mantine/core";
import {
	IconArrowBackUp,
	IconDots,
	IconLockSquareRounded,
	IconPencil,
	IconPlayerStop,
	IconSend,
	IconTrash,
	IconWand,
} from "@tabler/icons-react";
import { RelativeDate } from "@components/relative-date";
import { useLeadContext } from "../hooks/use-lead-context";
import { useReplyForm } from "../hooks/use-reply-form";
import {
	LeadPlatform,
	ReplyCharacterLimit,
	ReplyStatus,
} from "@sweetreply/shared/features/leads/constants";
import { getReplyStatusColor } from "@sweetreply/shared/features/leads/utils";
import { PlatformIcon } from "@components/platform-icon";
import { useMe } from "@features/auth/hooks/use-me";
import { SendReplyModal } from "./send-reply-modal";
import { useDisclosure } from "@mantine/hooks";
import { IconSweetReply } from "@components/icons/sweetreply";

export const RedditLead = () => {
	const lead = useLeadContext();
	const { me, isSubscribed } = useMe();
	const { form, replyLength, isEditing, onEdit, onCancel, onSubmit } = useReplyForm();
	const [isOpen, { open, close }] = useDisclosure();

	return (
		<Stack>
			<SendReplyModal
				leadId={lead.data.id}
				modalProps={{ centered: true, opened: isOpen, onClose: close }}
			/>
			{lead.data.locked && (
				<Center>
					<Tooltip
						label={`This lead is locked. This could be because the post is locked or deleted on ${lead.data.platform}.`}
					>
						<IconLockSquareRounded color="var(--mantine-color-red-5)" />
					</Tooltip>
				</Center>
			)}
			<Card withBorder>
				<Stack>
					<Flex justify="space-between">
						<Group align="center">
							<Avatar size="md" />
							<div>
								<Text size="sm">
									<Anchor
										href={`https://reddit.com/r/${lead.data.group}`}
										target="_blank"
										c="gray"
									>{`r/${lead.data.group}`}</Anchor>{" "}
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
								{lead.data.remote_url && (
									<Menu.Item
										component="a"
										target="_blank"
										href={lead.data.remote_url}
										leftSection={
											<PlatformIcon
												height={18}
												width={18}
												platform={lead.data.platform as any}
											/>
										}
									>
										View on Reddit
									</Menu.Item>
								)}
								{lead.canDeleteLead && (
									<Menu.Item
										onClick={lead.deleteLead}
										leftSection={<IconTrash size={18} />}
									>
										Delete
									</Menu.Item>
								)}
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

			<Card ml="4rem" withBorder>
				<Stack>
					<Flex justify="space-between">
						<Group align="center">
							<Avatar size="md">
								<IconSweetReply height={20} width={20} />
							</Avatar>
							<Text component="span" size="sm">
								Sweetreply
								{lead.replyDate && (
									<>
										{" "}
										•{" "}
										{lead.data.reply_status === ReplyStatus.SCHEDULED && (
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
								<ActionIcon
									variant="subtle"
									color="gray"
									disabled={lead.data.reply_status === ReplyStatus.PENDING}
								>
									<IconDots size={18} />
								</ActionIcon>
							</Menu.Target>
							<Menu.Dropdown>
								<Menu.Label>Reply actions</Menu.Label>
								{lead.data.reply_remote_url && (
									<Menu.Item
										component="a"
										target="_blank"
										href={lead.data.reply_remote_url}
										leftSection={
											<PlatformIcon
												height={18}
												width={18}
												platform={lead.data.platform as any}
											/>
										}
									>
										View on Reddit
									</Menu.Item>
								)}
								{lead.canSendReply && (
									<Menu.Item
										onClick={open}
										leftSection={<IconSend size={18} />}
										disabled={!isSubscribed || (me && me.reply_credits <= 0)}
									>
										Send reply
									</Menu.Item>
								)}
								{lead.canEditReply && (
									<Menu.Item
										onClick={lead.generateReply}
										leftSection={<IconWand size={18} />}
										disabled={!lead.canGenerateReply || !isSubscribed}
									>{`Generate reply (${lead.data.replies_generated}/2)`}</Menu.Item>
								)}
								{lead.canEditReply && (
									<Menu.Item
										onClick={onEdit}
										leftSection={<IconPencil size={18} />}
										disabled={!isSubscribed}
									>
										Edit reply
									</Menu.Item>
								)}
								{lead.canUndoReply && (
									<Menu.Item
										onClick={lead.undoReply}
										leftSection={<IconArrowBackUp size={18} />}
										disabled={!isSubscribed}
									>
										Undo reply
									</Menu.Item>
								)}
								{lead.canCancelReply && (
									<Menu.Item
										onClick={lead.cancelReply}
										leftSection={<IconPlayerStop />}
									>
										Cancel reply
									</Menu.Item>
								)}
							</Menu.Dropdown>
						</Menu>
					</Flex>
					{isEditing ? (
						<form onSubmit={onSubmit}>
							<Stack align="end">
								<Textarea
									autosize={true}
									error={form.formState.errors.reply_text?.message}
									w="100%"
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
					) : lead.generateReplyMutation.isLoading ? (
						<Skeleton height={100} />
					) : lead.data.reply_text ? (
						<Spoiler
							maxHeight={120}
							showLabel="Show more"
							hideLabel="hide"
							style={{ whiteSpace: "pre-wrap" }}
						>
							{lead.data.reply_text}
						</Spoiler>
					) : (
						<Text c="dimmed" fw="bold">
							No reply yet
						</Text>
					)}
					{lead.data.reply_status && (
						<>
							<Divider />
							<Flex justify="space-between">
								<Badge size="sm" bg={getReplyStatusColor(lead.data.reply_status)}>
									{lead.data.reply_status}
								</Badge>
								<Text
									size="xs"
									c="dimmed"
								>{`(${isEditing ? replyLength : lead.data.reply_text?.length ?? 0}/${ReplyCharacterLimit[LeadPlatform.REDDIT]})`}</Text>
							</Flex>
						</>
					)}
				</Stack>
			</Card>
		</Stack>
	);
};
