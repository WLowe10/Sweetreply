import { Box, Container, Image, Title } from "@mantine/core";
import { BaseLayout } from "./base";
import { appConfig } from "@replyon/shared/lib/constants";
import type { PropsWithChildren, ReactNode } from "react";

export type AuthPageLayoutProps = {
	pageTitle: string;
	title: string;
	subtitle: ReactNode;
};

export const AuthPageLayout = ({ pageTitle, title, subtitle, children }: PropsWithChildren<AuthPageLayoutProps>) => {
	return (
		<BaseLayout
			mih="100vh"
			display="flex"
			title={pageTitle}
			style={{ justifyContent: "center", alignItems: "center" }}
		>
			<Container miw={420} my={40}>
				<Image w={64} mx="auto" mb="md" radius="md" src={appConfig.iconUrl} />
				<Box mb={30} ta="center">
					<Title ta="center" size="h3" order={1}>
						{title}
					</Title>
					<Box c="dimmed">{subtitle}</Box>
				</Box>
				{children}
			</Container>
		</BaseLayout>
	);
};
