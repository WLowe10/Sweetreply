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
							support for X and Hacker News. As Reddit is our first platform, we are
							focusing on making it the best.
						</Accordion.Panel>
					</Accordion.Item>
					<Accordion.Item value="results">
						<Accordion.Control>
							How long does Sweetreply take to setup?
						</Accordion.Control>
						<Accordion.Panel>
							Sweetreply is designed to be user-friendly and easy to set up. After
							creating a project and setup your query, leads will begin appearing
							within minutes.
						</Accordion.Panel>
					</Accordion.Item>
					<Accordion.Item value="free-plan">
						<Accordion.Control>Is there a free plan?</Accordion.Control>
						<Accordion.Panel>
							If you do not purchase tokens, you will not be able to use Sweetreply to
							generate replies. However, you may use Sweetreply as a keyword
							monitoring tool free of charge.
						</Accordion.Panel>
					</Accordion.Item>
				</Accordion>
			</Container>
		</Box>
	);
};
