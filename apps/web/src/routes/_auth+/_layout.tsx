import { Box, Flex } from "@mantine/core";
import { Outlet } from "@remix-run/react";

export default function AuthLayout() {
	return (
		<Box mt={{ base: 0, sm: "6rem" }}>
			<Outlet />
		</Box>
	);
}
