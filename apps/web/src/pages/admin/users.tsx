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
import { useRouter } from "next/router";
import { IconChevronUp, IconDots } from "@tabler/icons-react";

export default function UsersPage() {
	const router = useRouter();
	const page = Number(router.query.page) || 0;
	// const [page, setPage] = useState<number>(0);
	const [limit, setLimit] = useState<number>(25);
	const [search, setSearch] = useInputState<string>("");
	const [debouncedSearch] = useDebouncedValue(search, 250);

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
		router.push(
			{
				query: {
					page: newPage,
				},
			},
			undefined,
			{
				shallow: true,
			}
		);
	};

	return (
		<Flex p="xl" direction="column">
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
											<Menu.Item>Delete sessions</Menu.Item>
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
							total={totalPages}
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
		</Flex>
	);
}
