import { Box, Container, SimpleGrid, Title } from "@mantine/core";
import { PricingCard, type PricingItem } from "./components/pricing-card";
import classes from "./pricing.module.css";

const plans: PricingItem[] = [
	{
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
		cta: {
			text: "Get started",
			to: "/sign-up",
		},
	},
	{
		title: "Hobby",
		description: "For small projects and experiments",
		interval: "mo",
		price: 19,
		featuresTitle: "Everything in Free, plus:",
		features: ["40 replies/mo", "Auto replies", "Scheduled replies"],
		cta: {
			text: "Get started",
			to: "/sign-up",
		},
	},
	{
		title: "Standard",
		description: "Best for small businesses",
		interval: "mo",
		price: 49,
		featuresTitle: "Everything in Hobby, plus:",
		features: ["200 replies/mo"],
		highlighed: true,
		cta: {
			text: "Get started",
			to: "/sign-up",
		},
	},
	{
		title: "Enterprise",
		description: "Best for large businesses",
		interval: "mo",
		price: 199,
		featuresTitle: "Everything in Standard, plus:",
		features: ["1000 replies/mo"],
		cta: {
			text: "Get started",
			to: "/sign-up",
		},
	},
];

export default function PricingPage() {
	return (
		<Box component="main" mb="4rem" mih="100vh">
			<Container size="lg">
				<Title className={classes.title} mb="4rem" fw={900} ta="center">
					We believe in straightforward pricing
				</Title>
				<SimpleGrid cols={{ base: 1, md: 2, lg: 4 }}>
					{plans.map((plan) => (
						<PricingCard key={plan.title} {...plan} />
					))}
				</SimpleGrid>
			</Container>
		</Box>
	);
}
