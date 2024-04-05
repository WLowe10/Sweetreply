import { LandingLayout } from "@/layouts";
import { Box, Button, Center, Flex, Text, Image } from "@mantine/core";
import { IconArrowNarrowRight } from "@tabler/icons-react";

export default function HomePage() {
	return (
		<LandingLayout>
			<Center mb="xl">
				<Flex direction="column" align="center">
					<Box ta="center" mb="2rem">
						<Text size="3rem" fw="bold" mb="lg">
							Your Personal AI Ambassador
						</Text>
						<Text size="lg" c="dimmed">
							Replyon mentions your product in conversations naturally
						</Text>
					</Box>
					<Button rightSection={<IconArrowNarrowRight size={18} />}>Get started</Button>
				</Flex>
			</Center>
			<Box p="lg" maw="72rem" mx="auto">
				<Image src="https://socialkiwi.co/static/imgs/post-scheduler.png" alt="Demo" />
			</Box>
		</LandingLayout>
	);
}
