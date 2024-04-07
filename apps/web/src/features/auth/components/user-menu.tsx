import Link from "next/link";
import { Avatar, Box, Group, Menu, Text, UnstyledButton, useMantineTheme } from "@mantine/core";
import { useMe, useSignOut } from "../hooks";
import { IconDoor, IconDoorExit, IconDoorOff, IconUser } from "@tabler/icons-react";

export const UserMenu = () => {
	const { me } = useMe();
	const { signOut } = useSignOut();
	const theme = useMantineTheme();

	return (
		<Menu width="target">
			<Menu.Target>
				{me ? (
					<UnstyledButton>
						<Group align="center">
							<Avatar>{me?.first_name.charAt(0) + me?.last_name.charAt(0)}</Avatar>
							<Box>
								<Text>
									{me.first_name} {me.last_name}
								</Text>
								<Text c="dimmed" size="sm">
									{me.email}
								</Text>
							</Box>
						</Group>
					</UnstyledButton>
				) : (
					<UnstyledButton>Please sign in</UnstyledButton>
				)}
			</Menu.Target>
			<Menu.Dropdown>
				<Menu.Item
					component={Link}
					href="/profile"
					leftSection={<IconUser size={18} color={theme.colors.gray[5]} />}
				>
					Profile
				</Menu.Item>
				{/* <Menu.Item
					leftSection={<IconDoorOff size={18} color={theme.colors.gray[5]} />}
					onClick={() => signOut()}
				>
					Sign out
				</Menu.Item> */}
			</Menu.Dropdown>
		</Menu>
	);
};
