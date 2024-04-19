import { Link, Outlet } from "@remix-run/react";
import {
	Anchor,
	Box,
	Button,
	Container,
	Divider,
	Flex,
	Group,
	Stack,
	Text,
	Title,
} from "@mantine/core";
import { useMe } from "@/features/auth/hooks";
import { appConfig } from "@sweetreply/shared/config";
import { IconBrandDiscordFilled, IconBrandXFilled } from "@tabler/icons-react";
import type { PropsWithChildren } from "react";

export default function LandingLayout() {
	const { isAuthenticated } = useMe();

	return (
		<>
			<Flex
				component="header"
				align="center"
				justify="space-between"
				pos="sticky"
				top={0}
				p="md"
				style={{ borderBottom: "1px solid dark", backdropFilter: "blur(4px)", zIndex: 99 }}
				maw="72rem"
				mb="10rem"
				w={"100%"}
				mx="auto"
			>
				<Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
					<Title order={2}>{appConfig.name}</Title>
				</Link>
				<Group>
					<Button
						component={Link}
						variant="subtle"
						color="gray"
						size="compact-sm"
						to="/pricing"
					>
						Pricing
					</Button>
					<Group>
						{isAuthenticated ? (
							<Button component={Link} to="/dashboard">
								Dashboard
							</Button>
						) : (
							<Button component={Link} to="/sign-in">
								Sign in
							</Button>
						)}
					</Group>
				</Group>
			</Flex>
			<Box component="main" px="lg">
				<Outlet />
			</Box>
			<Box maw="60rem" mx="auto">
				<Divider />
				<Flex
					component="footer"
					p="lg"
					pb="3rem"
					justify="spacebetween"
					direction={{ base: "column", sm: "row" }}
					gap={"6rem"}
				>
					<Stack>
						<Text fw="bold" size="lg">
							Sweetreply
						</Text>
						<Box>
							<Text>As sweet as candy</Text>
							<Text c="dimmed">© {new Date().getFullYear()}</Text>
						</Box>
						<Group>
							<Anchor component={Link} c="dimmed" to="">
								<IconBrandXFilled />
							</Anchor>
							<Anchor component={Link} c="dimmed" to="">
								<IconBrandDiscordFilled />
							</Anchor>
						</Group>
					</Stack>
					<Stack gap="xs">
						<Text fw="bold">Product</Text>
						<Anchor component={Link} c="dimmed" to="/features">
							Features
						</Anchor>
						<Anchor component={Link} c="dimmed" to="/pricing">
							Pricing
						</Anchor>
						<Anchor component={Link} c="dimmed" to="/pricing">
							What's new
						</Anchor>
						<Anchor component={Link} c="dimmed" to="/pricing">
							Roadmap
						</Anchor>
					</Stack>
					<Stack gap="xs">
						<Text fw="bold">Help</Text>
						<Anchor component={Link} c="dimmed" to="/help/get-started">
							Get started
						</Anchor>
						<Anchor component={Link} c="dimmed" to="">
							How-to guides
						</Anchor>
					</Stack>
					<Stack>
						<Stack gap="xs">
							<Text fw="bold">Resources</Text>
							<Anchor component={Link} c="dimmed" to="/help/terms-conditions">
								Terms & Conditions
							</Anchor>
							<Anchor component={Link} c="dimmed" to="/help/privacy-policy">
								Privacy Policy
							</Anchor>
						</Stack>
						<Stack gap="xs">
							<Text fw="bold">Compare</Text>
							<Anchor component={Link} c="dimmed" to="/compare/reply-guy">
								ReplyGuy alternative
							</Anchor>
						</Stack>
					</Stack>
				</Flex>
			</Box>
		</>
	);
}
