import { Box, Button, Flex, SimpleGrid, Text, Title, type BoxProps } from "@mantine/core";
import { ReplyCard, ReplyCardProps } from "./components/reply-card";
import { IconArrowNarrowRight } from "@tabler/icons-react";
import { Link } from "@remix-run/react";
import classes from "./hero.module.css";

const replyCards: ReplyCardProps[] = [
	{
		username: "John Doe",
		avatar: "https://www.redditstatic.com/shreddit/assets/snoovatar-back-64x64px.png",
		content: "Hello! I'm looking for a lawn mowing service",
		reply: "I can help you with that! I have a lawn mower and I'm available this weekend",
	},
	{
		username: "John Doe",
		avatar: "https://www.redditstatic.com/shreddit/assets/snoovatar-back-64x64px.png",
		content: "Hello! I'm looking for a lawn mowing service",
		reply: "I can help you with that! I have a lawn mower and I'm available this weekend",
	},
	{
		username: "John Doe",
		avatar: "https://www.redditstatic.com/shreddit/assets/snoovatar-back-64x64px.png",
		content: "Hello! I'm looking for a lawn mowing service",
		reply: "I can help you with that! I have a lawn mower and I'm available this weekend",
	},
];

export const Hero = (boxProps: BoxProps) => {
	return (
		<Box component="section" id="hero" {...boxProps}>
			<Flex direction="column" align="center" mb="3rem">
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

			<div className={classes.marquee_container}>
				{/* gradient overlays */}

				<div className={classes.marquee_overlay_top} />
				<div className={classes.marquee_overlay_bottom} />

				{/* marquee grid */}
				<div className={classes.marquee_grid}>
					{/* first */}

					<div className={classes.marquee}>
						<div className={`${classes.marquee_track} ${classes.animate_marquee}`}>
							<ReplyCard
								username="John Doe"
								avatar="https://www.redditstatic.com/shreddit/assets/snoovatar-back-64x64px.png"
								content="Hello! I'm looking for a lawn mowing service"
								reply="I can help you with that! I have a lawn mower and I'm available this weekend"
							/>
							<ReplyCard
								username="John Doe"
								avatar="https://www.redditstatic.com/shreddit/assets/snoovatar-back-64x64px.png"
								content="Hello! I'm looking for a lawn mowing service"
								reply="I can help you with that! I have a lawn mower and I'm available this weekend"
							/>
							<ReplyCard
								username="John Doe"
								avatar="https://www.redditstatic.com/shreddit/assets/snoovatar-back-64x64px.png"
								content="Hello! I'm looking for a lawn mowing service"
								reply="I can help you with that! I have a lawn mower and I'm available this weekend"
							/>
						</div>
						<div
							className={`${classes.marquee_track} ${classes.animate_marquee}`}
							aria-hidden="true"
						>
							<ReplyCard
								username="John Doe"
								avatar="https://www.redditstatic.com/shreddit/assets/snoovatar-back-64x64px.png"
								content="Hello! I'm looking for a lawn mowing service"
								reply="I can help you with that! I have a lawn mower and I'm available this weekend"
							/>
							<ReplyCard
								username="John Doe"
								avatar="https://www.redditstatic.com/shreddit/assets/snoovatar-back-64x64px.png"
								content="Hello! I'm looking for a lawn mowing service"
								reply="I can help you with that! I have a lawn mower and I'm available this weekend"
							/>
							<ReplyCard
								username="John Doe"
								avatar="https://www.redditstatic.com/shreddit/assets/snoovatar-back-64x64px.png"
								content="Hello! I'm looking for a lawn mowing service"
								reply="I can help you with that! I have a lawn mower and I'm available this weekend"
							/>
						</div>
					</div>

					{/* second */}

					<div className={classes.marquee}>
						<div className={`${classes.marquee_track} ${classes.animate_marquee_fast}`}>
							<ReplyCard
								username="John Doe"
								avatar="https://www.redditstatic.com/shreddit/assets/snoovatar-back-64x64px.png"
								content="Hello! I'm looking for a lawn mowing service"
								reply="I can help you with that! I have a lawn mower and I'm available this weekend"
							/>
							<ReplyCard
								username="John Doe"
								avatar="https://www.redditstatic.com/shreddit/assets/snoovatar-back-64x64px.png"
								content="Hello! I'm looking for a lawn mowing service"
								reply="I can help you with that! I have a lawn mower and I'm available this weekend"
							/>
							<ReplyCard
								username="John Doe"
								avatar="https://www.redditstatic.com/shreddit/assets/snoovatar-back-64x64px.png"
								content="Hello! I'm looking for a lawn mowing service"
								reply="I can help you with that! I have a lawn mower and I'm available this weekend"
							/>
						</div>
						<div
							className={`${classes.marquee_track} ${classes.animate_marquee_fast}`}
							aria-hidden="true"
						>
							<ReplyCard
								username="John Doe"
								avatar="https://www.redditstatic.com/shreddit/assets/snoovatar-back-64x64px.png"
								content="Hello! I'm looking for a lawn mowing service"
								reply="I can help you with that! I have a lawn mower and I'm available this weekend"
							/>
							<ReplyCard
								username="John Doe"
								avatar="https://www.redditstatic.com/shreddit/assets/snoovatar-back-64x64px.png"
								content="Hello! I'm looking for a lawn mowing service"
								reply="I can help you with that! I have a lawn mower and I'm available this weekend"
							/>
							<ReplyCard
								username="John Doe"
								avatar="https://www.redditstatic.com/shreddit/assets/snoovatar-back-64x64px.png"
								content="Hello! I'm looking for a lawn mowing service"
								reply="I can help you with that! I have a lawn mower and I'm available this weekend"
							/>
						</div>
					</div>

					{/* third */}

					<div className={classes.marquee}>
						<div className={`${classes.marquee_track} ${classes.animate_marquee}`}>
							<ReplyCard
								username="John Doe"
								avatar="https://www.redditstatic.com/shreddit/assets/snoovatar-back-64x64px.png"
								content="Hello! I'm looking for a lawn mowing service"
								reply="I can help you with that! I have a lawn mower and I'm available this weekend"
							/>
							<ReplyCard
								username="John Doe"
								avatar="https://www.redditstatic.com/shreddit/assets/snoovatar-back-64x64px.png"
								content="Hello! I'm looking for a lawn mowing service"
								reply="I can help you with that! I have a lawn mower and I'm available this weekend"
							/>
							<ReplyCard
								username="John Doe"
								avatar="https://www.redditstatic.com/shreddit/assets/snoovatar-back-64x64px.png"
								content="Hello! I'm looking for a lawn mowing service"
								reply="I can help you with that! I have a lawn mower and I'm available this weekend"
							/>
						</div>
						<div
							className={`${classes.marquee_track} ${classes.animate_marquee}`}
							aria-hidden="true"
						>
							<ReplyCard
								username="John Doe"
								avatar="https://www.redditstatic.com/shreddit/assets/snoovatar-back-64x64px.png"
								content="Hello! I'm looking for a lawn mowing service"
								reply="I can help you with that! I have a lawn mower and I'm available this weekend"
							/>
							<ReplyCard
								username="John Doe"
								avatar="https://www.redditstatic.com/shreddit/assets/snoovatar-back-64x64px.png"
								content="Hello! I'm looking for a lawn mowing service"
								reply="I can help you with that! I have a lawn mower and I'm available this weekend"
							/>
							<ReplyCard
								username="John Doe"
								avatar="https://www.redditstatic.com/shreddit/assets/snoovatar-back-64x64px.png"
								content="Hello! I'm looking for a lawn mowing service"
								reply="I can help you with that! I have a lawn mower and I'm available this weekend"
							/>
						</div>
					</div>
				</div>
			</div>
		</Box>
	);
};
