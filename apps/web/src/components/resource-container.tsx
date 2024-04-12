import { Box, Flex, Text, Title } from "@mantine/core";
import type { PropsWithChildren } from "react";

export type ResourceContainerProps = { title: string; subtitle?: string };

export const ResourceContainer = ({
	title,
	subtitle,
	children,
}: PropsWithChildren<ResourceContainerProps>) => {
	return (
		<Box flex={1} p="md">
			<Flex align="center">
				{/* <Breadcrumbs>
					<Button>home</Button>
				</Breadcrumbs> */}
			</Flex>
			<Box maw="58rem" mx="auto">
				<Box mt="3rem" mb="3rem">
					<Title order={2}>{title}</Title>
					{subtitle && <Text c="dimmed">{subtitle}</Text>}
				</Box>
				{children}
			</Box>
		</Box>
	);
};
