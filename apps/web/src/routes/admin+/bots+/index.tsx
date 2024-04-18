import { PlatformIcon } from "@/components/platform-icon";
import { ResourceContainer } from "@/components/resource-container";
import { useDataTableParams } from "@/hooks/use-data-table-params";
import { DataTable } from "@/components/data-table";
import { trpc } from "@/lib/trpc";
import { Table, Badge, Menu, ActionIcon, Skeleton, Center, Flex } from "@mantine/core";
import { useClipboard, useDisclosure } from "@mantine/hooks";
import { IconCheck, IconCopy, IconDots, IconX } from "@tabler/icons-react";
import { EditBotModal } from "@/features/admin/components/edit-bot-modal";
import { MetaFunction } from "@remix-run/react";
import { buildPageTitle } from "@/lib/utils";

export const meta: MetaFunction = () => [{ title: buildPageTitle("Bots", "Sweetreply Admin") }];

const Row = (bot: any) => {
	const clipboard = useClipboard();
	const [isOpen, { open, close }] = useDisclosure();

	return (
		<>
			<EditBotModal
				botId={bot.id}
				modalProps={{ centered: true, opened: isOpen, onClose: close }}
			/>
			<Table.Tr key={bot.id}>
				<Table.Td>
					<Flex align="center">
						<PlatformIcon
							platform={bot.platform}
							tooltip={true}
							height={18}
							width={18}
						/>
					</Flex>
				</Table.Td>
				<Table.Td>{bot.username}</Table.Td>
				<Table.Td>
					<ActionIcon
						variant="subtle"
						color="gray"
						onClick={() => clipboard.copy(bot.password)}
					>
						<IconCopy size={18} />
					</ActionIcon>
				</Table.Td>
				<Table.Td>{bot._count.leads}</Table.Td>
				<Table.Td>{bot._count.errors}</Table.Td>
				<Table.Td>
					<Badge color="green">{bot.status}</Badge>
				</Table.Td>
				<Table.Td>
					{bot.active ? (
						<IconCheck color="var(--mantine-color-green-5)" size={18} />
					) : (
						<IconX color="var(--mantine-color-red-5)" size={18} />
					)}
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
							<Menu.Item onClick={open}>Edit</Menu.Item>
						</Menu.Dropdown>
					</Menu>
				</Table.Td>
			</Table.Tr>
		</>
	);
};

const LoadingRow = () => {
	return (
		<Table.Tr>
			<Table.Td>
				<Skeleton height={"20px"} />
			</Table.Td>
			<Table.Td>
				<Skeleton height={"20px"} />
			</Table.Td>
			<Table.Td>
				<Skeleton height={"20px"} />
			</Table.Td>
			<Table.Td>
				<Skeleton height={"20px"} />
			</Table.Td>
			<Table.Td>
				<Skeleton height={"20px"} />
			</Table.Td>
			<Table.Td>
				<Skeleton height={"20px"} />
			</Table.Td>
			<Table.Td>
				<Skeleton height={"20px"} />
			</Table.Td>
			<Table.Td>
				<Skeleton height={"20px"} />
			</Table.Td>
		</Table.Tr>
	);
};

export default function BotsPage() {
	const params = useDataTableParams();

	const getBotsQuery = trpc.admin.bots.getMany.useQuery({
		query: params.query ?? undefined,
		pagination: {
			page: params.page - 1,
			limit: params.limit,
		},
	});

	return (
		<ResourceContainer title="Bots" subtitle="Manage and view all bots">
			<DataTable
				data={getBotsQuery.data?.data ?? []}
				searchPlaceholder="Search bots"
				total={getBotsQuery.data?.total || 0}
				params={params}
				isLoading={getBotsQuery.isLoading}
				header={
					<Table.Thead>
						<Table.Tr>
							<Table.Th>Platform</Table.Th>
							<Table.Th>Username</Table.Th>
							<Table.Th>Password</Table.Th>
							<Table.Th>Replies</Table.Th>
							<Table.Th>Errors</Table.Th>
							<Table.Th>Status</Table.Th>
							<Table.Th>Active</Table.Th>
							<Table.Th />
						</Table.Tr>
					</Table.Thead>
				}
				getKey={(bot) => bot.id}
				LoadingRow={LoadingRow}
				Row={Row}
			/>
		</ResourceContainer>
	);
}
