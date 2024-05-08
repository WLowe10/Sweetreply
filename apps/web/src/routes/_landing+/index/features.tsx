import { Title, Text, Container, Box, Timeline, type BoxProps } from "@mantine/core";
import { IconFilter, IconAnalyze, IconMessage, IconReload } from "@tabler/icons-react";
import classes from "./features.module.css";

export const Features = (boxProps: BoxProps) => {
	return (
		<Box component="section" id="features" {...boxProps}>
			<Title order={2} className={classes.title} ta="center" mt="sm">
				People scroll past paid ads
			</Title>
			<Text c="dimmed" className={classes.description} ta="center" mt="md">
				Seriously, when's the last time you've clicked on a social media ad and were
				actually engaged? Here's how we drive higher quality conversions.
			</Text>
			<Container size="sm" mt="xl">
				<Timeline bulletSize={30} active={2}>
					<Timeline.Item title="Filter" bullet={<IconFilter size={18} />}>
						<Text c="dimmed" size="sm" mb="sm">
							Sweetreply uses your filters to directly target your audience. We don't
							hope that your product is seen by the right people, we make sure it is.
						</Text>
						<Text c="dimmed" size="sm" fs="italic">
							Sweetreply finds new posts so fast that we had to add an option to slow
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
