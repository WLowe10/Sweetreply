import { Box, Flex } from "@mantine/core";
import { Outlet } from "@remix-run/react";

export default function AuthLayout() {
	return (
		<Box mt={{ base: "lg", sm: "6rem" }}>
			<Outlet />
		</Box>
	);
}
