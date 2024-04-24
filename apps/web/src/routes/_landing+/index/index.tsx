import { Box, Button, Center, Flex, Text, Image, Paper, Title, Container } from "@mantine/core";
import { IconArrowNarrowRight } from "@tabler/icons-react";
import { appConfig } from "@sweetreply/shared/config";
import { Features } from "./features";
import { Link, type MetaFunction } from "@remix-run/react";
import { FAQ } from "./faq";
import classes from "./index.module.css";
import { Playground } from "./playground";

export const meta: MetaFunction = () => {
	return [
		{ title: appConfig.name },
		{
			name: "description",
			content: "Sweetreply finds and engages with leads across social media.",
		},
	];
};

export default function HomePage() {
	return (
		<Container size="lg" mb="16rem">
			<Flex direction="column" align="center" mb="xl">
				<Box ta="center" mb="2rem">
					<Title className={classes.title} order={2} mb="lg">
						The Secret Weapon in Your Marketing Arsenal
					</Title>
					<Text size="lg" c="dimmed">
						Sweetreply, your AI ambassador, slips mentions of your product into
						conversations seamlessly.
					</Text>
				</Box>
				<Button
					component={Link}
					to="/sign-up"
					rightSection={<IconArrowNarrowRight size={18} />}
				>
					Get started
				</Button>
			</Flex>
			<Box p="lg" mb="12rem">
				<Paper shadow="lg" withBorder={true} radius="lg" style={{ overflow: "hidden" }}>
					<Image src="hero.png" alt="Sweetreply demo" />
				</Paper>
			</Box>
			<Playground mb="12rem" />
			<Features mb="12rem" />
			<FAQ />
		</Container>
	);
}
