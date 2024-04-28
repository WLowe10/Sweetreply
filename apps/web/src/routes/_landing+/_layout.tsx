import { Link, Outlet } from "@remix-run/react";
import { Anchor, Box, Button, Divider, Flex, Group, Image, Stack, Text } from "@mantine/core";
import { useMe } from "@features/auth/hooks/use-me";
import { IconBrandDiscordFilled, IconBrandXFilled } from "@tabler/icons-react";
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
				mb={{ base: "4rem", md: "6rem", lg: "10rem" }}
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
						<Image src="/logo-dark.png" alt="Sweetreply" h={38} w={120} />
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
							<Button
								component={Link}
								to={isAuthenticated ? "/dashboard" : "/sign-in"}
								variant="default"
							>
								{isAuthenticated ? "Dashboard" : "Sign in"}
							</Button>
						</Group>
					</Group>
				</Flex>
				<Divider
					opacity={scroll.y > 100 ? 1 : 0}
					style={{ transition: "opacity .2s ease-in-out" }}
				/>
			</Box>
			<Box component="main">
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
						<Box>
							<Image src="/logo-dark.png" alt="Sweetreply" h="32" w="100" />
						</Box>
						<Box>
							<Text size="sm" fw="bold">
								Worldwide
							</Text>
							<Text size="sm" c="dimmed">
								© {new Date().getFullYear()}
							</Text>
						</Box>
						{/* <Group>
							<Anchor component={Link} c="dimmed" to="">
								<IconBrandXFilled />
							</Anchor>
							<Anchor component={Link} c="dimmed" to="">
								<IconBrandDiscordFilled />
							</Anchor>
						</Group> */}
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
