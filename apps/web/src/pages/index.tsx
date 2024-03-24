import { Box, Button, Flex, Group, Title } from "@mantine/core";
import Link from "next/link";

export default function HomePage() {
	return (
		<Box mih="100vh">
			<Flex
				component="header"
				align="center"
				justify="space-between"
				p="md"
				style={{ borderBottom: "1px solid dark" }}
				maw="72rem"
				mx="auto"
			>
				<Link href="/" style={{ textDecoration: "none" }}>
					<Title order={2}>Replyon</Title>
				</Link>
				<Group>
					<Button component={Link} variant="subtle" color="gray" size="compact-sm" href="/demo">
						Demo
					</Button>
					<Button component={Link} variant="subtle" color="gray" size="compact-sm" href="/features">
						Features
					</Button>
					<Button component={Link} variant="subtle" color="gray" size="compact-sm" href="/pricing">
						Pricing
					</Button>
				</Group>
				<Group>
					<Button color="orange" component={Link} href="/sign-in">
						Sign in
					</Button>
				</Group>
			</Flex>
		</Box>
	);
}
