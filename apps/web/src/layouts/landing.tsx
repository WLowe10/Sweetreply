import { useMe } from "@/features/auth/hooks";
import {
	Anchor,
	Box,
	Button,
	Flex,
	Group,
	Stack,
	Text,
	Title,
	useMantineColorScheme,
} from "@mantine/core";
import { appConfig } from "@sweetreply/shared/lib/constants";
import { IconBrandDiscordFilled, IconBrandTwitterFilled } from "@tabler/icons-react";
import Link from "next/link";
import { type PropsWithChildren } from "react";

export const LandingLayout = ({ children }: PropsWithChildren) => {
	const { isAuthenticated } = useMe();

	return (
		<Flex mih="100vh" direction="column">
			<Flex
				component="header"
				align="center"
				justify="space-between"
				p="md"
				style={{ borderBottom: "1px solid dark" }}
				maw="72rem"
				mb="10rem"
				w={"100%"}
				mx="auto"
			>
				<Link href="/" style={{ textDecoration: "none", color: "inherit" }}>
					<Title order={2}>{appConfig.name}</Title>
				</Link>
				<Group>
					<Button
						component={Link}
						variant="subtle"
						color="gray"
						size="compact-sm"
						href="/features"
					>
						Features
					</Button>
					<Button
						component={Link}
						variant="subtle"
						color="gray"
						size="compact-sm"
						href="/pricing"
					>
						Pricing
					</Button>
					<Group>
						{isAuthenticated ? (
							<Button color="orange" component={Link} href="/dashboard">
								Dashboard
							</Button>
						) : (
							<Button color="orange" component={Link} href="/sign-in">
								Sign in
							</Button>
						)}
					</Group>
				</Group>
			</Flex>
			<Box flex={1}>{children}</Box>
			<Flex p="lg" pb="3rem" justify="space-between" maw="60rem" mx="auto" w="100%">
				<Stack>
					<Text fw="bold" size="lg">
						Sweetreply
					</Text>
					<Box>
						<Text tt="uppercase">Worldwide</Text>
						<Text c="dimmed">© {new Date().getFullYear()}</Text>
					</Box>
					<Group>
						<Anchor component={Link} c="dimmed" href="">
							<IconBrandTwitterFilled />
						</Anchor>
						<Anchor component={Link} c="dimmed" href="">
							<IconBrandDiscordFilled />
						</Anchor>
					</Group>
				</Stack>
				<Stack gap="xs">
					<Text fw="bold">Product</Text>
					<Anchor component={Link} c="dimmed" href="/features">
						Features
					</Anchor>
					<Anchor component={Link} c="dimmed" href="/pricing">
						Pricing
					</Anchor>
					<Anchor component={Link} c="dimmed" href="/pricing">
						What's new
					</Anchor>
					<Anchor component={Link} c="dimmed" href="/pricing">
						Roadmap
					</Anchor>
				</Stack>
				<Stack gap="xs">
					<Text fw="bold">Help</Text>
					<Anchor component={Link} c="dimmed" href="/features">
						Get started
					</Anchor>
					<Anchor component={Link} c="dimmed" href="/pricing">
						How-to guides
					</Anchor>
				</Stack>
				<Stack>
					<Stack gap="xs">
						<Text fw="bold">Resources</Text>
						<Anchor component={Link} c="dimmed" href="/pricing">
							Terms & Conditions
						</Anchor>
						<Anchor component={Link} c="dimmed" href="/pricing">
							Privacy Policy
						</Anchor>
					</Stack>
					<Stack gap="xs">
						<Text fw="bold">Compare</Text>
						<Anchor component={Link} c="dimmed" href="/pricing">
							ReplyGuy alternative
						</Anchor>
					</Stack>
				</Stack>
			</Flex>
		</Flex>
	);
};
