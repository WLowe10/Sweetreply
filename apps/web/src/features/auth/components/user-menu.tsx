import {
	Avatar,
	Box,
	Button,
	Group,
	Menu,
	Skeleton,
	Text,
	UnstyledButton,
	useMantineTheme,
} from "@mantine/core";
import { useMe } from "../hooks/use-me";
import { useSignOut } from "../hooks/use-sign-out";
import { IconDoorOff, IconShield, IconUser } from "@tabler/icons-react";
import { ProfileModal } from "./profile-modal";
import { useDisclosure } from "@mantine/hooks";
import { Link } from "@remix-run/react";

export const UserMenu = () => {
	const { me } = useMe();
	const { signOut } = useSignOut();
	const [isOpen, { open, close }] = useDisclosure();

	return (
		<>
			<ProfileModal
				modalProps={{ opened: isOpen || (me && !me.verified_at), onClose: close }}
			/>
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
						<Skeleton height={75} />
					)}
				</Menu.Target>
				<Menu.Dropdown>
					{me?.role === "admin" && (
						<Menu.Item
							component={Link}
							to="/admin"
							leftSection={
								<IconShield size={18} color="var(--mantine-color-gray-6)" />
							}
						>
							Admin panel
						</Menu.Item>
					)}
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
