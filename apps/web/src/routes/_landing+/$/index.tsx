import { Link, useNavigate, type MetaFunction } from "@remix-run/react";
import { Container, Title, Group, Button, Text } from "@mantine/core";
import { buildPageTitle } from "@/lib/utils";
import classes from "./not-found.module.css";

export const meta: MetaFunction = () => [{ title: buildPageTitle("Not Found") }];

export default function NotFoundPage() {
	const navigate = useNavigate();

	return (
		<Container className={classes.root} mb="6rem">
			<div className={classes.label}>404</div>
			<Title className={classes.title}>Nothing to see here</Title>
			<Text c="dimmed" size="lg" ta="center" className={classes.description}>
				Unfortunately, this page does not exist. You may have mistyped the address, or the
				page has been moved to another URL.
			</Text>
			<Group justify="center">
				<Button size="md" variant="subtle" onClick={() => navigate(-1)}>
					Go back
				</Button>
				<Button size="md" component={Link} to="/">
					Home
				</Button>
			</Group>
		</Container>
	);
}
