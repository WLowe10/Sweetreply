import { Box, Button, Card, Flex, List, Stack, Text, Title } from "@mantine/core";
import { IconCheck } from "@tabler/icons-react";
import { Link } from "@remix-run/react";

export type PricingItem = {
	title: string;
	description: string;
	price: number;
	interval: string;
	featuresTitle?: string;
	features: string[];
	highlighed?: boolean;
	cta?: {
		text: string;
		to: string;
	};
};

export type PricingCardProps = PricingItem;

export const PricingCard = ({
	title,
	description,
	price,
	interval,
	featuresTitle,
	features,
	highlighed,
	cta,
}: PricingCardProps) => {
	return (
		<Card
			withBorder
			shadow="sm"
			style={{
				borderColor: highlighed ? "var(--mantine-color-blue-filled)" : undefined,
			}}
		>
			<Flex direction="column" justify="space-between" flex={1}>
				<div>
					<Stack>
						<Title order={3}>{title}</Title>
						<Text>{description}</Text>
						<Text size="2.5rem" fw="bold">
							{`$${price}`}
							<Text component="span" c="dimmed" size="sm">{`/${interval}`}</Text>
						</Text>
					</Stack>
					<Box mt="lg">
						{featuresTitle && (
							<Text size="md" mb="lg">
								{featuresTitle}
							</Text>
						)}
						<List
							spacing="xs"
							size="sm"
							c="dimmed"
							center
							icon={<IconCheck color="var(--mantine-color-blue-5)" />}
						>
							{features.map((feature) => (
								<List.Item key={feature}>{feature}</List.Item>
							))}
						</List>
					</Box>
				</div>
				{cta && (
					<Button
						component={Link}
						to={cta.to}
						mt="xl"
						style={{ justifySelf: "flex-end" }}
					>
						{cta.text}
					</Button>
				)}
			</Flex>
		</Card>
	);
};
