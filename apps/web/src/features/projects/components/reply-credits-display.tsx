import {
	Box,
	Button,
	Card,
	Flex,
	Group,
	Progress,
	Skeleton,
	Stack,
	Text,
	ThemeIcon,
} from "@mantine/core";
import { BuyTokensModal } from "./buy-tokens-modal";
import { useDisclosure } from "@mantine/hooks";
import { useCurrentProjectQuery } from "../hooks/use-current-project";
import { IconMessage } from "@tabler/icons-react";

export const ReplyCreditsDisplay = () => {
	const { data } = useCurrentProjectQuery();
	const [opened, { open, close }] = useDisclosure(false);

	return (
		<Card withBorder={true}>
			<BuyTokensModal modalProps={{ centered: true, opened, onClose: close }} />
			{data ? (
				<Stack>
					<Flex direction="row" align="center">
						<ThemeIcon variant="subtle" mr={2}>
							<IconMessage size={18} />
						</ThemeIcon>
						<Text size="xs">{`${data.reply_credits} ${
							data.reply_credits === 1 ? "reply" : "replies"
						} remaining`}</Text>
					</Flex>
					<Progress value={60} />
					<Button size="xs" onClick={open}>
						Get more
					</Button>
				</Stack>
			) : (
				<Skeleton height={60} />
			)}
		</Card>
	);
};
