import Link from "next/link";
import {
	Avatar,
	Box,
	Button,
	Group,
	Menu,
	Text,
	UnstyledButton,
	useMantineTheme,
} from "@mantine/core";
import { useMe, useSignOut } from "../hooks";
import { IconDoor, IconDoorExit, IconDoorOff, IconUser } from "@tabler/icons-react";
import { ProfileModal } from "./profile-modal";
import { useDisclosure } from "@mantine/hooks";

export const UserMenu = () => {
	const { me } = useMe();
	const { signOut } = useSignOut();
	const [isOpen, { open, close }] = useDisclosure();

	return (
		<>
			<ProfileModal modalProps={{ opened: isOpen, onClose: close }} />
			<Menu width="target">
				<Menu.Target>
					{me ? (
						<UnstyledButton color="gray">
							<Group align="center">
								<Avatar>
									{me?.first_name.charAt(0) + me?.last_name.charAt(0)}
								</Avatar>
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
						leftSection={<IconUser size={18} color="var(--mantine-color-gray-6)" />}
						onClick={open}
					>
						Profile
					</Menu.Item>
					<Menu.Item
						leftSection={<IconDoorOff size={18} color="var(--mantine-color-gray-6)" />}
						onClick={() => signOut()}
					>
						Sign out
					</Menu.Item>
				</Menu.Dropdown>
			</Menu>
		</>
	);
};
