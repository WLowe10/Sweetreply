import { useState } from "react";
import {
	ActionIcon,
	Anchor,
	Box,
	Button,
	Flex,
	Group,
	Menu,
	Pagination,
	Select,
	Table,
	Text,
	TextInput,
	Title,
} from "@mantine/core";
import { useDebouncedState, useDebouncedValue, useInputState } from "@mantine/hooks";
import { trpc } from "@/lib/trpc";
import { IconChevronUp, IconDots } from "@tabler/icons-react";
import { useSearchParams } from "@remix-run/react";
import { ResourceContainer } from "@/components/resource-container";

export default function UsersPage() {
	const [params, setParams] = useSearchParams();
	const [limit, setLimit] = useState<number>(25);
	const [search, setSearch] = useInputState<string>("");
	const [debouncedSearch] = useDebouncedValue(search, 250);
	const page = Number(params.get("page")) || 0;

	const getUsersQuery = trpc.admin.users.getMany.useQuery({
		search: debouncedSearch,
		sort: {
			sessions: "desc",
		},
		pagination: {
			page,
			limit,
		},
	});

	const rowStart = page * limit + 1;
	const rowEnd = Math.min((page + 1) * limit, getUsersQuery.data?.total ?? 0);
	const totalPages = getUsersQuery.data?.total ? Math.ceil(getUsersQuery.data?.total / limit) : 0;

	const onPageChange = (newPage: number) => {
		setParams((prev) => {
			prev.set("page", newPage.toString());

			return prev;
		});
	};

	const deleteSessionsMutation = trpc.admin.users.deleteSessions.useMutation();

	return (
		<ResourceContainer title="Users" subtitle="Manage and view all users">
			<Box>
				<Flex>
					<TextInput placeholder="Search users" value={search} onChange={setSearch} />
				</Flex>
				<Table my="sm">
					<Table.Thead>
						<Table.Tr>
							<Table.Th>Email</Table.Th>
							<Table.Th>Role</Table.Th>
							<Table.Th>First name</Table.Th>
							<Table.Th>Last name</Table.Th>
							<Table.Th>Sessions</Table.Th>
							<Table.Th>Joined at</Table.Th>
							<Table.Th />
						</Table.Tr>
					</Table.Thead>
					<Table.Tbody>
						{getUsersQuery.data?.data.map((user) => (
							<Table.Tr key={user.id}>
								<Table.Td>
									<Anchor size="sm" href={`mailto:${user.email}`}>
										{user.email}
									</Anchor>
								</Table.Td>
								<Table.Td>{user.role}</Table.Td>
								<Table.Td>{user.first_name}</Table.Td>
								<Table.Td>{user.last_name}</Table.Td>
								<Table.Td>{user["_count"]["sessions"]}</Table.Td>
								<Table.Td>{user.created_at.toDateString()}</Table.Td>
								<Table.Td>
									<Menu transitionProps={{ transition: "pop" }}>
										<Menu.Target>
											<ActionIcon variant="subtle" color="gray">
												<IconDots size={18} />
											</ActionIcon>
										</Menu.Target>
										<Menu.Dropdown>
											<Menu.Label>Actions</Menu.Label>
											<Menu.Item
												onClick={() =>
													deleteSessionsMutation.mutate({
														userId: user.id,
													})
												}
											>
												Delete sessions
											</Menu.Item>
											<Menu.Item>Send password reset</Menu.Item>
											<Menu.Item>Send email verification</Menu.Item>
										</Menu.Dropdown>
									</Menu>
								</Table.Td>
							</Table.Tr>
						))}
					</Table.Tbody>
				</Table>
				<Flex justify="space-between" align="center">
					<Group>
						<Pagination
							total={10}
							value={page + 1}
							onChange={(pageNum) => onPageChange(pageNum - 1)}
						/>
						<Select data={["10", "25", "50"]} width={"sm"} />
						<Text size="sm" c="dimmed">{`Showing ${rowStart} - ${rowEnd} of ${
							getUsersQuery.data?.total ?? 0
						} results`}</Text>
					</Group>
				</Flex>
			</Box>
		</ResourceContainer>
	);
}
