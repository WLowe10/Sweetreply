import { Anchor, Box, Breadcrumbs, Button, Flex, Group, Title } from "@mantine/core";
import type { PropsWithChildren } from "react";

export const ResourceLayout = ({ children }: PropsWithChildren) => {
	return (
		<Box flex={1} p="md">
			<Flex align="center">
				{/* <Breadcrumbs>
					<Button>home</Button>
				</Breadcrumbs> */}
			</Flex>
			<Box maw="58rem" mx="auto">
				<Box mt="3rem" mb="3rem">
					<Title order={2}>Settings</Title>
				</Box>
				{children}
			</Box>
		</Box>
	);
};
