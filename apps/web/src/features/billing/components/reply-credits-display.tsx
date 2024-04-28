import { Box, Button, Card, Flex, Progress, Skeleton, Stack, Text, ThemeIcon } from "@mantine/core";
import { IconMessage } from "@tabler/icons-react";
import { useMe } from "@features/auth/hooks/use-me";
import { useReplyCreditsUsage } from "../hooks/use-reply-credits-usage";
import { Link } from "@remix-run/react";

export const ReplyCreditsDisplay = () => {
	const { me } = useMe();
	const usage = useReplyCreditsUsage();

	return (
		<Card withBorder={true}>
			{me ? (
				<Stack>
					<Flex direction="row" align="center">
						<ThemeIcon variant="subtle" color="blue.5" mr={2}>
							<IconMessage size={18} />
						</ThemeIcon>
						<Text size="xs">{`${me.reply_credits} ${
							me.reply_credits === 1 ? "reply" : "replies"
						} remaining`}</Text>
					</Flex>
					<Progress value={usage} />
					<Button component={Link} to="/billing" size="xs">
						Get more
					</Button>
				</Stack>
			) : (
				<Skeleton height={60} />
			)}
		</Card>
	);
};
