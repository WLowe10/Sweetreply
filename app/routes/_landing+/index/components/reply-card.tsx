import { IconSweetReply } from "@/components/icons/sweetreply";
import { Avatar, Card, Group, Stack, Text } from "@mantine/core";

export type ReplyCardProps = {
	content: string;
	username: string;
	avatar: string;
	reply: string;
};

export const ReplyCard = ({ avatar, username, content, reply }: ReplyCardProps) => {
	return (
		<Stack gap="xs">
			<Card withBorder>
				<Stack>
					<Group gap="sm" align="center">
						<Avatar size="sm" alt={username} src={avatar} />
						<Text size="xs" c="dimmed">
							{username}
						</Text>
					</Group>
					<Text size="sm">{content}</Text>
				</Stack>
			</Card>
			<Card withBorder ml="lg">
				<Stack>
					<Group gap="sm" align="center">
						<IconSweetReply height={24} width={24} />
						<Text size="xs" c="dimmed">
							Sweetreply
						</Text>
					</Group>
					<Text size="sm">{reply}</Text>
				</Stack>
			</Card>
		</Stack>
	);
};
