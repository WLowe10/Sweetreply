import { Button, Card, Group, Stack, Text } from "@mantine/core";
import { IconCoin, IconCoins } from "@tabler/icons-react";
import { BuyTokensModal } from "./buy-tokens-modal";
import { useDisclosure } from "@mantine/hooks";
import { useCurrentProjectQuery } from "../hooks/use-current-project";

export const TokensDisplay = () => {
	const { data } = useCurrentProjectQuery();
	const [opened, { open, close }] = useDisclosure(false);

	return (
		<Card withBorder={true}>
			<BuyTokensModal modalProps={{ centered: true, opened, onClose: close }} />
			<Stack>
				<Group gap="xs">
					<IconCoins size={18} color="var(--mantine-color-yellow-5)" />
					<Text size="sm">{data?.tokens} tokens</Text>
				</Group>

				<Button size="xs" onClick={open}>
					Get more
				</Button>
			</Stack>
		</Card>
	);
};
