import { UserMenu } from "@features/auth/components/user-menu";
import { Badge, Box, Flex, NavLink, Stack } from "@mantine/core";
import { Link, Outlet, useLocation } from "@remix-run/react";
import {
	IconBox,
	IconHome,
	IconLayoutDashboard,
	IconMessageReply,
	IconSettings,
	IconUser,
} from "@tabler/icons-react";

export default function AdminLayout() {
	const location = useLocation();

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
					<Badge>Admin Panel</Badge>
					<Box>
						<NavLink
							component={Link}
							active={location.pathname === "/admin"}
							color="gray"
							to=""
							label="Home"
							leftSection={<IconHome size={18} color="var(--mantine-color-gray-6)" />}
						/>
						<NavLink
							component={Link}
							active={location.pathname.includes("users")}
							color="gray"
							to="users"
							label="Users"
							leftSection={<IconUser size={18} color="var(--mantine-color-gray-6)" />}
						/>
						<NavLink
							component={Link}
							active={location.pathname.includes("projects")}
							color="gray"
							to="projects"
							label="Projects"
							leftSection={<IconBox size={18} color="var(--mantine-color-gray-6)" />}
						/>
						<NavLink
							component={Link}
							active={location.pathname.includes("bots")}
							color="gray"
							to="bots"
							label="Bots"
							leftSection={
								<IconMessageReply size={18} color="var(--mantine-color-gray-6)" />
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
