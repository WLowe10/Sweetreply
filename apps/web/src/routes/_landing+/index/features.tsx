import {
	Badge,
	Group,
	Title,
	Text,
	Card,
	SimpleGrid,
	Container,
	rem,
	useMantineTheme,
} from "@mantine/core";
import { IconGauge, IconUser, IconCookie, IconBolt } from "@tabler/icons-react";
import classes from "./features.module.css";

const featuresData = [
	{
		title: "Never miss a mention",
		description:
			"Our powerful monitoring system tracks mentions of your products across social media platforms, ensuring you never miss a customer interaction opportunity.",
		icon: IconGauge,
	},
	{
		title: "Simplicity in mind",
		description:
			"People say it can run at the same speed as lightning striking, Its icy body is so cold, it will not melt even if it is immersed in magma",
		icon: IconUser,
	},
	{
		title: "Go a step further",
		description:
			"By responding quickly and effectively to social media mentions, you build stronger customer relationships, increase brand loyalty, and ultimately drive sales",
		icon: IconBolt,
	},
];

export const Features = () => {
	const theme = useMantineTheme();

	return (
		<Container component="section" id="features" size="lg" py="xl">
			<Group justify="center">
				<Badge variant="filled" size="lg">
					Features
				</Badge>
			</Group>

			<Title order={2} className={classes.title} ta="center" mt="sm">
				Automation that works for you
			</Title>

			<Text c="dimmed" className={classes.description} ta="center" mt="md"></Text>

			<SimpleGrid cols={{ base: 1, md: 3 }} spacing="xl" mt={50}>
				{featuresData.map((feature) => (
					<Card
						key={feature.title}
						shadow="md"
						radius="md"
						className={classes.card}
						padding="xl"
					>
						<feature.icon
							style={{ width: rem(50), height: rem(50) }}
							stroke={2}
							color={theme.colors.blue[6]}
						/>
						<Text fz="lg" fw={500} className={classes.cardTitle} mt="md">
							{feature.title}
						</Text>
						<Text fz="sm" c="dimmed" mt="sm">
							{feature.description}
						</Text>
					</Card>
				))}
			</SimpleGrid>
		</Container>
	);
};
