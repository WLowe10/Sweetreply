import { Box, Container, Image, Stack, Text, Title } from "@mantine/core";
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
			<Container miw={420} mt={40}>
				<Image w={64} mx="auto" mb="md" radius="md" src={"icon.jpg"} />
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
