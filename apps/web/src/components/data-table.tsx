import {
	ActionIcon,
	Box,
	Flex,
	Group,
	Menu,
	Pagination,
	Select,
	Table,
	TextInput,
	Text,
	Badge,
} from "@mantine/core";
import { trpc } from "@/lib/trpc";
import { useDataTableParams } from "@/hooks/use-data-table-params";
import { IconDots } from "@tabler/icons-react";

export const DataTable = () => {
	const { page, limit, query, setPage, setLimit, setQuery } = useDataTableParams();

	// add project id to backend
	const getLeadsQuery = trpc.leads.getMany.useQuery({
		query: query ?? undefined,
		pagination: {
			page: page - 1,
			limit: limit,
		},
	});

	return (
		<Box>
			<Flex>
				<TextInput
					placeholder="Search leads"
					value={query || ""}
					onChange={(e) => setQuery(e.target.value)}
				/>
			</Flex>
			<Table my="sm">
				<Table.Thead>
					<Table.Tr>
						<Table.Th>Platform</Table.Th>
						<Table.Th>Username</Table.Th>
						<Table.Th>Content</Table.Th>
						<Table.Th>Time</Table.Th>
						<Table.Th>Replied</Table.Th>
						<Table.Th />
					</Table.Tr>
				</Table.Thead>
				<Table.Tbody>
					{getLeadsQuery.data?.data.map((lead) => (
						<Table.Tr key={lead.id}>
							<Table.Td>{lead.platform}</Table.Td>
							<Table.Td>{lead.username}</Table.Td>
							<Table.Td>{lead.content}</Table.Td>
							<Table.Td>{lead.date.toDateString()}</Table.Td>
							<Table.Td>
								<Badge>{lead.replied_at ? "true" : "false"}</Badge>
							</Table.Td>
							<Table.Td>
								<Menu transitionProps={{ transition: "pop" }}>
									<Menu.Target>
										<ActionIcon variant="subtle" color="gray">
											<IconDots size={18} />
										</ActionIcon>
									</Menu.Target>
									<Menu.Dropdown>
										<Menu.Label>Actions</Menu.Label>
										<Menu.Item>View on Reddit</Menu.Item>
									</Menu.Dropdown>
								</Menu>
							</Table.Td>
						</Table.Tr>
					))}
				</Table.Tbody>
			</Table>
			<Flex justify="space-between" align="center">
				<Group>
					<Pagination total={10} value={page} onChange={(pageNum) => setPage(pageNum)} />
					<Select
						width={"sm"}
						data={["10", "25", "50"]}
						value={limit.toString()}
						onChange={setLimit}
					/>
					{/* <Text size="sm" c="dimmed">{`Showing ${rowStart} - ${rowEnd} of ${
						getUsersQuery.data?.total ?? 0
					} results`}</Text> */}
				</Group>
			</Flex>
		</Box>
	);
};
