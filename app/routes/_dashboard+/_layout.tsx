import { useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "@remix-run/react";
import { Box, Divider, Flex, NavLink, Stack } from "@mantine/core";
import {
	IconBook,
	IconCreditCard,
	IconLayoutDashboard,
	IconMessageReply,
	IconSettings,
} from "@tabler/icons-react";
import { UserMenu } from "@/features/auth/components/user-menu";
import { ProjectSelector } from "@/features/projects/components/project-selector";
import { ReplyCreditsDisplay } from "@/features/billing/components/reply-credits-display";
import { useMe } from "@/features/auth/hooks/use-me";
import { useProjectsQuery } from "@/features/projects/hooks/use-projects-query";
import { CreateProjectForm } from "@/features/projects/components/create-project-form";
import { ResourceContainer } from "@/components/resource-container";

export default function DashboardLayout() {
	const { me, isAuthenticated, isInitialized } = useMe();
	const { data: projects } = useProjectsQuery();
	const navigate = useNavigate();
	const location = useLocation();

	const hasNoProjects = projects && projects.length === 0;

	useEffect(() => {
		if (isInitialized && !isAuthenticated) {
			return navigate("/sign-in");
		}

		if (me && !me.verified_at) {
			navigate("/verify");
		}
	}, [me, isInitialized, isAuthenticated]);

	return (
		<Flex mih="100vh">
			<Flex
				w="280"
				pos="fixed"
				h="100%"
				direction="column"
				justify="space-between"
				p="lg"
				style={{
					overflow: "auto",
					borderRight: "1px solid var(--mantine-color-default-border)",
				}}
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
						<NavLink
							active={location.pathname.includes("billing")}
							component={Link}
							label="Billing"
							color="gray"
							to="/billing"
							leftSection={
								<IconCreditCard size={18} color="var(--mantine-color-gray-6)" />
							}
						/>
						<Divider />
						<NavLink
							component={Link}
							label="Guide"
							color="gray"
							to="/help/get-started"
							leftSection={<IconBook size={18} color="var(--mantine-color-gray-6)" />}
						/>
					</Box>
				</Stack>
				<Stack>
					<ReplyCreditsDisplay />
					<Divider />
					<UserMenu />
				</Stack>
			</Flex>
			<Box ml="280" flex={1} mih="100vh" style={{ overflow: "auto" }}>
				{hasNoProjects ? (
					<ResourceContainer title="Create your first project">
						<CreateProjectForm />
					</ResourceContainer>
				) : (
					<Outlet />
				)}
			</Box>
		</Flex>
	);
}
