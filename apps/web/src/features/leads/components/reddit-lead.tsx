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
} from "@mantine/core";
import { IconDots } from "@tabler/icons-react";
import { RelativeDate } from "@/components/relative-date";
import { useLeadContext } from "../hooks/use-lead-context";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	EditReplyInputType,
	editReplyInputSchema,
} from "@sweetreply/shared/features/leads/schemas";

export const RedditLead = () => {
	const lead = useLeadContext();
	const [isEditing, setIsEditing] = useState(false);

	const form = useForm<EditReplyInputType["data"]>({
		resolver: zodResolver(editReplyInputSchema.shape.data),
		values: {
			reply_text: lead.data.reply_text || "",
		},
	});

	const handleEdit = form.handleSubmit((data) => {
		lead.updateReply(data.reply_text);

		// should ideally wait for the mutation to complete before setting isEditing to false
		setIsEditing(false);
	});

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
										• <RelativeDate date={lead.data.created_at} />
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
						<Menu>
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
			{lead.data.reply_status && (
				<Card ml="6rem">
					<Stack>
						<Flex justify="space-between">
							<Group align="center">
								<Avatar size="md">🍭</Avatar>
								<Text component="span" size="sm">
									Sweetreply •{" "}
									<RelativeDate c="dimmed" date={lead.data.created_at} />
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
									{lead.canReply && (
										<Menu.Item onClick={lead.reply}>Reply</Menu.Item>
									)}
									{lead.canUpdateReply && (
										<Menu.Item onClick={() => setIsEditing(true)}>
											Edit reply
										</Menu.Item>
									)}
									{lead.canDeleteReply && (
										<Menu.Item onClick={lead.deleteReply}>
											Delete reply
										</Menu.Item>
									)}
								</Menu.Dropdown>
							</Menu>
						</Flex>
						{isEditing ? (
							<form onSubmit={handleEdit}>
								<Stack>
									<Textarea autosize={true} {...form.register("reply_text")} />
									<ButtonGroup>
										<Button variant="subtle" color="gray">
											Cancel
										</Button>
										<Button type="submit" disabled={!form.formState.isDirty}>
											Save
										</Button>
									</ButtonGroup>
								</Stack>
							</form>
						) : (
							<Spoiler maxHeight={120} showLabel="Show more" hideLabel="hide">
								{lead.data.reply_text}
							</Spoiler>
						)}
						<Badge
							size="sm"
							// c={
							// 	lead.data.reply_status === "deleted"
							// 		? "red"
							// 		: lead.data.reply_status === "replied"
							// 			? "blue"
							// 			: "dimmed"
							// }
						>
							{lead.data.reply_status}
						</Badge>
					</Stack>
				</Card>
			)}
		</Stack>
	);
};
