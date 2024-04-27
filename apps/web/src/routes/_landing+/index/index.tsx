import { Link } from "@remix-run/react";
import { Box, Button, Flex, Text, Image, Paper, Title, Container } from "@mantine/core";
import { IconArrowNarrowRight } from "@tabler/icons-react";
import { Features } from "./features";
import { FAQ } from "./faq";
import { Playground } from "./playground";
import classes from "./index.module.css";

export default function HomePage() {
	return (
		<Container size="lg" mb="16rem" px="lg">
			<section id="hero">
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
						// variant="gradient"
						// gradient={{ from: "red", to: "red.5", deg: 90 }}
						rightSection={<IconArrowNarrowRight size={18} />}
					>
						Get started
					</Button>
				</Flex>
				<Box mb="20rem">
					<Paper shadow="lg" withBorder={true} radius="lg" style={{ overflow: "hidden" }}>
						<Image src="hero.png" alt="Sweetreply demo" />
					</Paper>
				</Box>
			</section>
			<Playground mb="20rem" />
			<Features mb="20rem" />
			<FAQ />
		</Container>
	);
}
