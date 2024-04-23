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
// import { BuyTokensModal } from "./buy-tokens-modal";
import { useDisclosure } from "@mantine/hooks";
import { useCurrentProjectQuery } from "../../projects/hooks/use-current-project";
import { IconMessage } from "@tabler/icons-react";
import { useMe } from "@/features/auth/hooks/use-me";

export const ReplyCreditsDisplay = () => {
	const [opened, { open, close }] = useDisclosure(false);
	const { me } = useMe();

	return (
		<Card withBorder={true}>
			{/* <BuyTokensModal modalProps={{ centered: true, opened, onClose: close }} /> */}
			{me ? (
				<Stack>
					<Flex direction="row" align="center">
						<ThemeIcon variant="subtle" mr={2}>
							<IconMessage size={18} />
						</ThemeIcon>
						<Text size="xs">{`${me.reply_credits} ${
							me.reply_credits === 1 ? "reply" : "replies"
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
