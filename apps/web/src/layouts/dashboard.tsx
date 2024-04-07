import { ProfileModal, UserMenu } from "@/features/auth/components";
import { CreateTeamModal } from "@/features/team/components/create-team-modal";
import { TeamProvider } from "@/features/team/provider";
import { useCurrentTeamQuery } from "@/features/team/hooks/use-current-team";
import { trpc } from "@/lib/trpc";
import {
	Avatar,
	Box,
	Button,
	Flex,
	NavLink,
	Popover,
	Stack,
	ThemeIcon,
	UnstyledButton,
	useMantineTheme,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
	IconMessageReply,
	IconRobotFace,
	IconSettings,
	IconSwitchVertical,
	IconUsersGroup,
} from "@tabler/icons-react";
import type { PropsWithChildren } from "react";
import Link from "next/link";

const TeamSelector = () => {
	const { data: currentTeam } = useCurrentTeamQuery();
	const { data: teams } = trpc.teams.getMany.useQuery();

	const [
		teamsPopoverOpened,
		{ open: openTeamsPopover, close: closeTeamsPopover, toggle: toggleTeamsPopover },
	] = useDisclosure(false);

	const [createTeamModalOpened, { open: openCreateTeamModal, close: closeCreateTeamModal }] =
		useDisclosure(false);

	return (
		<>
			<Popover
				position="bottom-start"
				opened={teamsPopoverOpened}
				onChange={(status) => (status ? openTeamsPopover() : closeTeamsPopover())}
			>
				<Popover.Target>
					<Button
						variant="subtle"
						fullWidth
						justify="start"
						leftSection={<Avatar size="sm">R</Avatar>}
						rightSection={<IconSwitchVertical size={16} />}
						onClick={toggleTeamsPopover}
					>
						{currentTeam?.name}
					</Button>
				</Popover.Target>
				<Popover.Dropdown>
					<Stack>
						{teams?.map((team) => (
							<UnstyledButton key={team.id}>{team.name}</UnstyledButton>
						))}
					</Stack>
					<Button
						onClick={() => {
							closeTeamsPopover();
							openCreateTeamModal();
						}}
					>
						Create Team
					</Button>
				</Popover.Dropdown>
			</Popover>
			<CreateTeamModal
				modalProps={{
					centered: true,
					opened: createTeamModalOpened,
					onClose: closeCreateTeamModal,
				}}
			/>
		</>
	);
};

export const DashboardLayout = ({ children }: PropsWithChildren) => {
	const theme = useMantineTheme();

	return (
		<TeamProvider>
			<Flex mih="100vh">
				<ProfileModal />
				<Flex
					w="250"
					pos="fixed"
					h="100%"
					direction="column"
					justify="space-between"
					p="lg"
					style={{ borderRight: "1px solid var(--mantine-color-default-border)" }}
				>
					<Stack>
						<TeamSelector />
						<Box>
							<NavLink
								label="Team"
								component={Link}
								href="/dashboard"
								leftSection={
									<IconUsersGroup size={18} color={theme.colors.gray[5]} />
								}
							/>
							<NavLink
								component={Link}
								href="/leads"
								label="Leads"
								leftSection={
									<IconMessageReply size={18} color={theme.colors.gray[5]} />
								}
							/>
							<NavLink
								label="Settings"
								component={Link}
								href="/settings"
								leftSection={
									<IconSettings size={18} color={theme.colors.gray[5]} />
								}
							/>
						</Box>
					</Stack>
					<UserMenu />
				</Flex>
				<Box ml="250" flex={1} mih="100vh">
					{children}
				</Box>
			</Flex>
		</TeamProvider>
	);
};
