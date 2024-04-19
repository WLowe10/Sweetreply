import { Box, TypographyStylesProvider } from "@mantine/core";
import { Outlet } from "@remix-run/react";

export default function HelpLayout() {
	return (
		<Box maw="60rem" mx="auto" w="100%" mb="10rem">
			<TypographyStylesProvider>
				<Outlet />
			</TypographyStylesProvider>
		</Box>
	);
}
