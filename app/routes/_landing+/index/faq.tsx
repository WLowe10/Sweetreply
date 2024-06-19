import { Accordion, Box, type BoxProps, Container, Title } from "@mantine/core";
import classes from "./faq.module.css";

export const FAQ = (boxProps: BoxProps) => {
	return (
		<Box component="section" id="faq" {...boxProps}>
			<Container size="md">
				<Title order={2} className={classes.title} ta="center" mb={50}>
					Frequently Asked Questions
				</Title>
				<Accordion>
					<Accordion.Item value="sites">
						<Accordion.Control>
							What social media sites do you support?
						</Accordion.Control>
						<Accordion.Panel>
							Currently we only support Reddit, however we are working on adding
							support for X and Hacker News. As Reddit is our first and the most
							important platform, we are focusing on making it the best.
						</Accordion.Panel>
					</Accordion.Item>
					<Accordion.Item value="results">
						<Accordion.Control>
							How long does Sweetreply take to setup?
						</Accordion.Control>
						<Accordion.Panel>
							Sweetreply is designed to be user-friendly and easy to set up. After
							creating a project and setting up your filters, leads will begin
							appearing within minutes of them being posted.
						</Accordion.Panel>
					</Accordion.Item>
					<Accordion.Item value="replies">
						<Accordion.Control>Where do the replies come from?</Accordion.Control>
						<Accordion.Panel>
							We reply to your leads using our pool of Reddit accounts. We plan to
							allow you to connect your own accounts soon.
						</Accordion.Panel>
					</Accordion.Item>
					<Accordion.Item value="other">
						<Accordion.Control>What are some other features?</Accordion.Control>
						<Accordion.Panel>
							We also allow you to schedule and manually create replies.
						</Accordion.Panel>
					</Accordion.Item>
					<Accordion.Item value="free-plan">
						<Accordion.Control>Is there a free plan?</Accordion.Control>
						<Accordion.Panel>
							If you do not purchase a subscription, you will not be able to use
							Sweetreply to generate replies. However, you may use Sweetreply as a
							keyword monitoring tool free of charge.
						</Accordion.Panel>
					</Accordion.Item>
				</Accordion>
			</Container>
		</Box>
	);
};
