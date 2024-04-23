import { Link, Outlet, useLocation } from "@remix-run/react";
import { UserMenu } from "@/features/auth/components/user-menu";
import { ProjectSelector } from "@/features/projects/components/project-selector";
import { Box, Divider, Flex, NavLink, Stack } from "@mantine/core";
import {
	IconGridGoldenratio,
	IconLayoutDashboard,
	IconMessageReply,
	IconSettings,
} from "@tabler/icons-react";
import { ReplyCreditsDisplay } from "@/features/projects/components/reply-credits-display";

export default function DashboardLayout() {
	const location = useLocation();

	return (
		<Flex mih="100vh">
			<Flex
				w="280"
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
							active={location.pathname.includes("dashboard")}
							color="gray"
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
							active={location.pathname.includes("leads")}
							color="gray"
							to="/leads"
							label="Leads"
							leftSection={
								<IconMessageReply size={18} color="var(--mantine-color-gray-6)" />
							}
						/>
						<NavLink
							active={location.pathname.includes("settings")}
							component={Link}
							label="Settings"
							color="gray"
							to="/settings"
							leftSection={
								<IconSettings size={18} color="var(--mantine-color-gray-6)" />
							}
						/>
					</Box>
				</Stack>
				<Stack>
					<ReplyCreditsDisplay />
					<Divider />
					<UserMenu />
				</Stack>
			</Flex>
			<Box ml="280" flex={1} mih="100vh">
				<Outlet />
			</Box>
		</Flex>
	);
}
