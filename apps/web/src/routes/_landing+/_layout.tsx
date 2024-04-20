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
import { useWindowScroll } from "@mantine/hooks";

export default function LandingLayout() {
	const { isAuthenticated } = useMe();
	const [scroll] = useWindowScroll();

	return (
		<>
			<Box
				component="header"
				pos="sticky"
				top={0}
				style={{
					WebkitBackdropFilter: "blur(4px)",
					backdropFilter: "blur(4px)",
					zIndex: 99,
				}}
				mb="10rem"
			>
				<Flex
					maw="72rem"
					mx="auto"
					align="center"
					justify="space-between"
					p="md"
					w={"100%"}
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
				<Divider
					opacity={scroll.y > 100 ? 1 : 0}
					style={{ transition: "opacity .2s ease-in-out" }}
				/>
			</Box>
			<Box component="main" px="lg">
				<Outlet />
			</Box>
			<Box component="footer" maw="64rem" mx="auto" w="100%">
				<Divider />
				<Flex
					p="lg"
					pb="3rem"
					justify="space-between"
					direction={{ base: "column", sm: "row" }}
					gap={"2rem"}
					mx="auto"
				>
					<Stack>
						<Text fw="bold" size="lg">
							Sweetreply
						</Text>
						<Box>
							<Text size="sm" fw="bold">
								Worldwide
							</Text>
							<Text size="sm" c="dimmed">
								© {new Date().getFullYear()}
							</Text>
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
						<Anchor component={Link} c="dimmed" to="/#features">
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
						{/* <Stack gap="xs">
							<Text fw="bold">Compare</Text>
							<Anchor component={Link} c="dimmed" to="/compare/reply-guy">
								ReplyGuy alternative
							</Anchor>
						</Stack> */}
					</Stack>
				</Flex>
			</Box>
		</>
	);
}
