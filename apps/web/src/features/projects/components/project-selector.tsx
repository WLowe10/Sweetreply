import { Button, Flex, Popover } from "@mantine/core";
import { IconPlus, IconSwitchVertical } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { trpc } from "@/lib/trpc";
import { CreateProjectModal } from "./create-project-modal";
import { useCurrentProjectQuery } from "../hooks/use-current-project";
import { useLocalProject } from "../hooks/use-local-project";

export const ProjectSelector = () => {
	const [id, setId] = useLocalProject();
	const { data: currentProject } = useCurrentProjectQuery();
	const { data: projects } = trpc.projects.getMany.useQuery();

	const [
		projectsPopoverOpened,
		{ open: openProjectsPopover, close: closeProjectsPopover, toggle: toggleProjectsPopover },
	] = useDisclosure(false);

	const [
		createProjectModalOpened,
		{ open: openCreateProjectModal, close: closeCreateProjectModal },
	] = useDisclosure(false);

	return (
		<>
			<Popover
				position="bottom-start"
				width="target"
				opened={projectsPopoverOpened}
				onChange={(status) => (status ? openProjectsPopover() : closeProjectsPopover())}
			>
				<Popover.Target>
					<Button
						variant="subtle"
						color="gray"
						fullWidth
						justify="space-between"
						rightSection={<IconSwitchVertical size={16} />}
						onClick={toggleProjectsPopover}
					>
						{currentProject?.name}
					</Button>
				</Popover.Target>
				<Popover.Dropdown p={0}>
					<Flex direction="column">
						{projects?.map((team) => (
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
							closeProjectsPopover();
							openCreateProjectModal();
						}}
					>
						Create Project
					</Button>
				</Popover.Dropdown>
			</Popover>
			<CreateProjectModal
				modalProps={{
					centered: true,
					opened: createProjectModalOpened,
					onClose: closeCreateProjectModal,
				}}
			/>
		</>
	);
};
