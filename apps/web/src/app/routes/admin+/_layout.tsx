import { Flex } from "@mantine/core";
import { Outlet } from "@remix-run/react";

export default function AdminLayout() {
	return (
		<Flex mih="100vh">
			<Outlet />
		</Flex>
	);
}
