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
	Box,
	type BoxProps,
	Paper,
	Timeline,
	Center,
} from "@mantine/core";
import {
	IconGauge,
	IconUser,
	IconCookie,
	IconBolt,
	IconFilter,
	IconAnalyze,
	IconMessage,
	IconRepeat,
	IconReload,
} from "@tabler/icons-react";
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

export const Features = (boxProps: BoxProps) => {
	const theme = useMantineTheme();

	return (
		<Box component="section" id="features" {...boxProps}>
			<Title order={2} className={classes.title} ta="center" mt="sm">
				People scroll past paid ads
			</Title>

			<Text c="dimmed" className={classes.description} ta="center" mt="md">
				Seriously, when's the last time you've clicked on a social media ad and were
				actually engaged? Here's how we drive higher quality conversions.
			</Text>

			{/* <SimpleGrid cols={{ base: 1, md: 3 }} spacing="xl" mt={50}>
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
			</SimpleGrid> */}

			<Container size="sm" mt="xl">
				<Timeline bulletSize={30} active={2}>
					<Timeline.Item title="Filter" bullet={<IconFilter size={18} />}>
						<Text c="dimmed" size="sm" mb="sm">
							Sweetreply uses your filters to directly target your audience. We don't
							hope that your ad will be seen by the right people, we make sure it is.
						</Text>
						<Text c="dimmed" size="sm" fs="italic">
							Sweetreply finds new posts so fast that we had to add a setting to slow
							it down (seriously).
						</Text>
					</Timeline.Item>
					<Timeline.Item title="Sentiment analysis" bullet={<IconAnalyze size={18} />}>
						<Text c="dimmed" size="sm">
							After finding a potential post to reply to, Sweetreply checks to make
							sure it is relevant and worthy of a response.
						</Text>
					</Timeline.Item>
					<Timeline.Item title="Reply" bullet={<IconMessage size={18} />}>
						<Text c="dimmed" size="sm">
							If the post passes the sentiment analysis, Sweetreply will automatically
							generate a reply and respond to your lead!
						</Text>
					</Timeline.Item>
					<Timeline.Item title="Repeat" bullet={<IconReload size={18} />}>
						<Text c="dimmed" size="sm">
							Did we mention that this happens automatically?
						</Text>
					</Timeline.Item>
				</Timeline>
			</Container>
		</Box>
	);
};
