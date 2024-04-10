import { Avatar, Box, Button, Flex, Popover, Stack, UnstyledButton } from "@mantine/core";
import { IconPlus, IconSwitchVertical } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { trpc } from "@/lib/trpc";
import { CreateProjectModal } from "./create-project-modal";
import { useCurrentProjectQuery } from "../hooks/use-current-project";
import { useLocalProject } from "../hooks/use-local-project";

export const ProjectSelector = () => {
	const [id, setId] = useLocalProject();
	const { data: currentProject } = useCurrentProjectQuery();
	const { data: teams } = trpc.projects.getMany.useQuery();

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
				width="target"
				opened={teamsPopoverOpened}
				onChange={(status) => (status ? openTeamsPopover() : closeTeamsPopover())}
			>
				<Popover.Target>
					<Button
						variant="subtle"
						color="gray"
						fullWidth
						justify="space-between"
						rightSection={<IconSwitchVertical size={16} />}
						onClick={toggleTeamsPopover}
					>
						{currentProject?.name}
					</Button>
				</Popover.Target>
				<Popover.Dropdown p={0}>
					<Flex direction="column">
						{teams?.map((team) => (
							<Button
								color="gray"
								variant="subtle"
								key={team.id}
								onClick={() => setId(team.id)}
							>
								{team.name}
							</Button>
						))}
					</Flex>
					<Button
						fullWidth={true}
						style={{
							borderTopRightRadius: 0,
							borderTopLeftRadius: 0,
						}}
						leftSection={<IconPlus size={16} />}
						onClick={() => {
							closeTeamsPopover();
							openCreateTeamModal();
						}}
					>
						Create Project
					</Button>
				</Popover.Dropdown>
			</Popover>
			<CreateProjectModal
				modalProps={{
					centered: true,
					opened: createTeamModalOpened,
					onClose: closeCreateTeamModal,
				}}
			/>
		</>
	);
};
