import {
	Anchor,
	Avatar,
	Card,
	Group,
	Stack,
	Text,
	type TextProps,
	Title,
	Tooltip,
	Spoiler,
	Flex,
	Menu,
	ActionIcon,
	MenuLabel,
} from "@mantine/core";
import { formatRelative } from "date-fns";
import type { Lead } from "@sweetreply/prisma";
import { IconDots } from "@tabler/icons-react";
import { trpc } from "@/lib/trpc";
import { notifications } from "@mantine/notifications";

type Props = {
	lead: Lead;
};

const DateRelative = ({ date, ...textProps }: { date: Date } & TextProps) => {
	return (
		<Tooltip label={date.toDateString()}>
			<Text component="time" {...textProps}>
				{formatRelative(date, new Date())}
			</Text>
		</Tooltip>
	);
};

export const RedditLead = ({ lead }: Props) => {
	const deleteReplyMutation = trpc.leads.deleteReply.useMutation();

	const handleDeleteReply = async () => {
		deleteReplyMutation.mutate(
			{ lead_id: lead.id },
			{
				onSuccess: () => {
					notifications.show({
						title: "Reply deleted",
						message: "This reply has been removed from Reddit",
					});
				},
				onError: (err) => {
					notifications.show({
						title: "Failed to delete reply",
						message: err.message,
						color: "red",
					});
				},
			}
		);
	};

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
										href={`https://reddit.com/r/${lead.channel}`}
										target="_blank"
										c="gray"
									>{`r/${lead.channel}`}</Anchor>{" "}
									<Text component="span" c="dimmed">
										• <DateRelative date={lead.created_at} />
									</Text>
								</Text>
								<Anchor
									href={`https://reddit.com/user/${lead.username}`}
									target="_blank"
									size="sm"
									c="gray"
								>
									{lead.username}
								</Anchor>
							</div>
						</Group>
						<Menu>
							<Menu.Target>
								<ActionIcon variant="subtle" color="gray">
									<IconDots size={18} />
								</ActionIcon>
							</Menu.Target>
							<Menu.Dropdown>
								<Menu.Label>Lead actions</Menu.Label>
								<Menu.Item component="a" target="_blank" href={lead.remote_url!}>
									View on Reddit
								</Menu.Item>
							</Menu.Dropdown>
						</Menu>
					</Flex>
					<Stack>
						<Title order={4}>{lead.title}</Title>
						<Spoiler maxHeight={120} showLabel="Show more" hideLabel="hide">
							{lead.content}
						</Spoiler>
					</Stack>
				</Stack>
			</Card>
			{lead.reply_text && (
				<Card ml="6rem">
					<Stack>
						<Flex justify="space-between">
							<Group align="center">
								<Avatar size="md">🍭</Avatar>
								<Text component="span" size="sm">
									Sweetreply • <DateRelative c="dimmed" date={lead.created_at} />
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
									<Menu.Item onClick={handleDeleteReply}>Delete reply</Menu.Item>
								</Menu.Dropdown>
							</Menu>
						</Flex>
						<Text>{lead.reply_text}</Text>
					</Stack>
				</Card>
			)}
		</Stack>
	);
};
