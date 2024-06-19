import { Box, Container, TypographyStylesProvider } from "@mantine/core";
import { Outlet } from "@remix-run/react";

export default function HelpLayout() {
	return (
		<Container size="md" mb="10rem">
			<TypographyStylesProvider>
				<Outlet />
			</TypographyStylesProvider>
		</Container>
	);
}
