import { IconReddit } from "@/components/icons";
import { DashboardLayout } from "@/layouts/dashboard";
import { ResourceLayout } from "@/layouts/resource";
import {
	ActionIcon,
	Box,
	Card,
	Group,
	HoverCard,
	Menu,
	MenuItem,
	MenuLabel,
	Pagination,
	Stack,
	Table,
	Text,
	TextInput,
	Tooltip,
} from "@mantine/core";
import { IconDots, IconMenu } from "@tabler/icons-react";

const LeadsPage = () => {
	return (
		<ResourceLayout>
			<Stack gap={"xl"}>
				<Group>
					<TextInput placeholder="Search leads" />
				</Group>
				<Table>
					<Table.Thead>
						<Table.Tr>
							<Table.Th />
							<Table.Th>Username</Table.Th>
							<Table.Th>Content</Table.Th>
							<Table.Th>Reply</Table.Th>
							<Table.Th>Date</Table.Th>
							<Table.Th />
						</Table.Tr>
					</Table.Thead>
					<Table.Tbody>
						<Table.Tr>
							<Table.Td align="center">
								<Tooltip label={"Reddit"}>
									<div>
										<IconReddit height={18} width={18} />
									</div>
								</Tooltip>
							</Table.Td>
							<Table.Td>RefrigeratorCold</Table.Td>
							<Table.Td>Sweetreply</Table.Td>
							<Table.Td maw="200px">
								<Text size="sm" truncate="end">
									adaw awda awdwadw adwdwd adaw awdawd adwawdad adwadwdada
								</Text>
							</Table.Td>
							<Table.Td>2021-09-01</Table.Td>
							<Table.Td>
								<Menu>
									<Menu.Target>
										<ActionIcon variant="subtle" color="gray">
											<IconDots size={18} />
										</ActionIcon>
									</Menu.Target>
									<Menu.Dropdown>
										<MenuLabel>Actions</MenuLabel>
										<MenuItem>View on Reddit</MenuItem>
										<MenuItem>Approve reply</MenuItem>
									</Menu.Dropdown>
								</Menu>
							</Table.Td>
						</Table.Tr>
					</Table.Tbody>
				</Table>
				<Group>
					<Pagination total={5} />
				</Group>
			</Stack>
		</ResourceLayout>
	);
};

LeadsPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default LeadsPage;
