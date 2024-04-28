import { Box, Button, Center, Container, SimpleGrid, Text, Title } from "@mantine/core";
import { PricingCard, type PricingItem } from "../../../features/billing/components/pricing-card";
import { Link } from "@remix-run/react";
import { plans } from "@features/billing/constants";
import { buildPageTitle, mergeMeta } from "@lib/utils";
import classes from "./pricing.module.css";
import type { MetaFunction } from "@remix-run/react";

const TITLE = buildPageTitle("Pricing");

export const meta: MetaFunction = mergeMeta(() => [
	{
		title: TITLE,
	},
	{
		tagName: "meta",
		property: "og:title",
		content: TITLE,
	},
]);

const freePlan: PricingItem = {
	id: "free",
	title: "Free",
	description: "Try out Sweetreply",
	interval: "forever",
	price: 0,
	features: [
		"Ultra-fast monitoring",
		"Advanced querying",
		"Enhanced Reddit filtering",
		"Webhook notifications",
		"Results within one minute",
	],
};

export default function PricingPage() {
	return (
		<Box component="main" mb="4rem" mih="100vh">
			<Container size="lg">
				<Box className={classes.title} ta="center" mb="4rem">
					<Title fw={900} mb="sm">
						We believe in straightforward pricing
					</Title>
					<Text size="lg" c="dimmed">
						No hidden fees, cancel anytime
					</Text>
				</Box>
				<SimpleGrid cols={{ base: 1, md: 2, lg: 4 }}>
					<PricingCard
						{...freePlan}
						cta={
							<Button component={Link} to="/sign-up" mt="md">
								Get started
							</Button>
						}
					/>
					{plans.map((plan) => (
						<PricingCard
							key={plan.title}
							{...plan}
							cta={
								<Button component={Link} to="/sign-up" mt="md">
									Get started
								</Button>
							}
						/>
					))}
				</SimpleGrid>
			</Container>
		</Box>
	);
}
