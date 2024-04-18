import { Box, Card, Flex, Group, Stack, Text, Title } from "@mantine/core";
import { IconX } from "@tabler/icons-react";

export default function PricingPage() {
	return (
		<Box component="main" mb="6rem" mih="100vh">
			<Flex mx="auto" maw="52rem" align="center" direction="column">
				<Title mb="4rem">We believe in straightforward pricing</Title>
				<Card>
					<Title order={3}>$0.50/token</Title>
					<Text c="dimmed">Pay for tokens, use them on your own schedule</Text>
					<Stack gap="xs">
						<Group>
							{/* <IconX /> */}
							<Text>No subscriptions</Text>
						</Group>
						<Text>No hidden fees</Text>
					</Stack>
				</Card>
			</Flex>
		</Box>
	);
}
