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
} from "@mantine/core";
import { formatRelative } from "date-fns";
import type { Lead } from "@sweetreply/prisma";

type Props = {
	lead: Lead;
};

const rt = new Intl.RelativeTimeFormat("en", { style: "short" });

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
	return (
		<Stack>
			<Card>
				<Stack>
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
					<Stack>
						<Title order={4}>{lead.title}</Title>
						<Text>{lead.content}</Text>
					</Stack>
				</Stack>
			</Card>
			{lead.reply && (
				<Card ml="6rem">
					<Stack>
						<Group align="center">
							<Avatar size="md">🍭</Avatar>
							<Text component="span" size="sm">
								Sweetreply • <DateRelative c="dimmed" date={lead.created_at} />
							</Text>
						</Group>
						<Text>{lead.reply}</Text>
					</Stack>
				</Card>
			)}
		</Stack>
	);
};
