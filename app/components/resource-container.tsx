import { Box, Container, Flex, Text, Title } from "@mantine/core";
import type { PropsWithChildren, ReactNode } from "react";

export type ResourceContainerProps = { title: string; subtitle?: string; rightSection?: ReactNode };

export const ResourceContainer = ({
	title,
	subtitle,
	rightSection,
	children,
}: PropsWithChildren<ResourceContainerProps>) => {
	return (
		<Box flex={1} p="md">
			<Container size="lg" mx="auto">
				<Flex direction="row" justify="space-between" align="center">
					<Box mt="3rem" mb="3rem">
						<Title order={2}>{title}</Title>
						{subtitle && <Text c="dimmed">{subtitle}</Text>}
					</Box>
					{rightSection}
				</Flex>
				{children}
			</Container>
		</Box>
	);
};
