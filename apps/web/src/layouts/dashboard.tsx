import { UserMenu } from "@/features/auth/components";
import { ProjectSelector } from "@/features/projects/components/project-selector";
import { Box, Flex, NavLink, Popover, Stack, Text, UnstyledButton } from "@mantine/core";
import { IconMessageReply, IconSettings, IconUsersGroup } from "@tabler/icons-react";
import Link from "next/link";
import type { PropsWithChildren } from "react";

export const DashboardLayout = ({ children }: PropsWithChildren) => {
	return (
		<Flex mih="100vh">
			<Flex
				w="250"
				pos="fixed"
				h="100%"
				direction="column"
				justify="space-between"
				p="lg"
				style={{ borderRight: "1px solid var(--mantine-color-default-border)" }}
			>
				<Stack>
					<ProjectSelector />
					<Box>
						<NavLink
							component={Link}
							href="/leads"
							label="Leads"
							leftSection={
								<IconMessageReply size={18} color="var(--mantine-color-gray-6)" />
							}
						/>
						<NavLink
							label="Settings"
							component={Link}
							href="/settings"
							leftSection={
								<IconSettings size={18} color="var(--mantine-color-gray-6)" />
							}
						/>
					</Box>
				</Stack>
				<UserMenu />
			</Flex>
			<Box ml="250" flex={1} mih="100vh">
				{children}
			</Box>
		</Flex>
	);
};
