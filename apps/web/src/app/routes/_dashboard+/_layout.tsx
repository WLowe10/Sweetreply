import { Link, Outlet } from "@remix-run/react";
import { UserMenu } from "@/features/auth/components/user-menu";
import { ProjectSelector } from "@/features/projects/components/project-selector";
import { Box, Flex, NavLink, Stack } from "@mantine/core";
import {
	IconGridGoldenratio,
	IconLayoutDashboard,
	IconMessageReply,
	IconSettings,
} from "@tabler/icons-react";

export default function DashboardLayout() {
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
							to="/dashboard"
							label="Dashboard"
							leftSection={
								<IconLayoutDashboard
									size={18}
									color="var(--mantine-color-gray-6)"
								/>
							}
						/>
						<NavLink
							component={Link}
							to="/leads"
							label="Leads"
							leftSection={
								<IconMessageReply size={18} color="var(--mantine-color-gray-6)" />
							}
						/>
						<NavLink
							label="Settings"
							component={Link}
							to="/settings"
							leftSection={
								<IconSettings size={18} color="var(--mantine-color-gray-6)" />
							}
						/>
					</Box>
				</Stack>
				<UserMenu />
			</Flex>
			<Box ml="250" flex={1} mih="100vh">
				<Outlet />
			</Box>
		</Flex>
	);
}
