import { Link, Outlet, useLocation, useNavigate } from "@remix-run/react";
import { UserMenu } from "@/features/auth/components/user-menu";
import { ProjectSelector } from "@/features/projects/components/project-selector";
import { Box, Center, Container, Divider, Flex, NavLink, Stack } from "@mantine/core";
import { IconLayoutDashboard, IconMessageReply, IconSettings } from "@tabler/icons-react";
import { ReplyCreditsDisplay } from "@/features/billing/components/reply-credits-display";
import { useMe } from "@/features/auth/hooks/use-me";
import { useEffect } from "react";
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
			return navigate("/");
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
				{hasNoProjects ? (
					<ResourceContainer
						title="Create your first project"
						subtitle="Setup your first project!"
					>
						<CreateProjectForm />
					</ResourceContainer>
				) : (
					<Outlet />
				)}
			</Box>
		</Flex>
	);
}
