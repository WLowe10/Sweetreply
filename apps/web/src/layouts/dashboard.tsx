import { ProfileModal, UserMenu } from "@/features/auth/components";
import { Box, Flex, NavLink, Stack } from "@mantine/core";
import type { PropsWithChildren } from "react";

export const DashboardLayout = ({ children }: PropsWithChildren) => {
	return (
		<Flex mih="100vh">
			<ProfileModal />
			<Flex w="250" pos="fixed" h="100%" direction="column" justify="space-between" p="lg">
				<Box>
					<NavLink label="Team" />
					<NavLink label="Control room" />
				</Box>
				<UserMenu />
			</Flex>
			<Box ml="250">{children}</Box>
		</Flex>
	);
};
