import { Button, Card, Group, Stack, Text } from "@mantine/core";
import { IconCoin, IconCoins } from "@tabler/icons-react";

export const TokensDisplay = () => {
	return (
		<Card withBorder={true}>
			<Stack>
				<Group gap="xs">
					<IconCoins size={18} color="var(--mantine-color-yellow-5)" />
					<Text size="sm">100 tokens</Text>
				</Group>

				<Button
					size="xs"
					variant="gradient"
					autoContrast={true}
					gradient={{ from: "#415EDA", to: "#7f8dc9" }}
				>
					Get more
				</Button>
			</Stack>
		</Card>
	);
};
