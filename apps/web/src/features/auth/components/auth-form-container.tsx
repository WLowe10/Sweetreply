import { Box, Center, Container, Image, Stack, Text, Title } from "@mantine/core";
import { Link } from "@remix-run/react";
import { appConfig } from "@sweetreply/shared/config";
import type { PropsWithChildren, ReactNode } from "react";

export type AuthPageLayoutProps = {
	title: string;
	subtitle: ReactNode;
};

export const AuthFormContainer = ({
	title,
	subtitle,
	children,
}: PropsWithChildren<AuthPageLayoutProps>) => {
	return (
		<Stack align="center">
			<Container size={"xs"} w="100%">
				<Center mb="md">
					<Link to="/">
						<Image h="64px" w="64px" radius="md" src="/icon.svg" />
					</Link>
				</Center>
				<Box mb={30} ta="center">
					<Title ta="center" size="h3" order={1}>
						{title}
					</Title>
					<Box c="dimmed">{subtitle}</Box>
				</Box>
				{children}
			</Container>
			<Text size="sm" c="dimmed">
				{appConfig.name} @ {new Date().getFullYear()}
			</Text>
		</Stack>
	);
};
