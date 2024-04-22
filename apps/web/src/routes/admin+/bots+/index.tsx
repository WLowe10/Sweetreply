import { PlatformIcon } from "@/components/platform-icon";
import { ResourceContainer } from "@/components/resource-container";
import { useDataTableParams } from "@/features/data-table/hooks/use-data-table-params";
import { trpc } from "@/lib/trpc";
import {
	Table,
	Badge,
	Menu,
	ActionIcon,
	Skeleton,
	Center,
	Flex,
	Button,
	Group,
	Box,
	Text,
	Stack,
	Card,
} from "@mantine/core";
import { useClipboard, useDisclosure } from "@mantine/hooks";
import { IconCheck, IconCopy, IconDots, IconX } from "@tabler/icons-react";
import { EditBotModal } from "@/features/admin/components/edit-bot-modal";
import { MetaFunction } from "@remix-run/react";
import { buildPageTitle } from "@/lib/utils";
import { CreateBotModal } from "@/features/admin/components/create-bot-modal";
import { DataTable } from "@/features/data-table/components/data-table";
import { RouterOutput } from "@server/router";
import type { SimpleTableColumns } from "@/components/simple-table";

export const meta: MetaFunction = () => [{ title: buildPageTitle("Bots", "Sweetreply Admin") }];

const columns: SimpleTableColumns<RouterOutput["admin"]["bots"]["getMany"]["data"][0]> = [
	{
		id: "platform",
		Header: () => "Platform",
		Cell: (data) => <PlatformIcon platform={data.platform as any} height={20} width={20} />,
	},
	{
		id: "username",
		Header: () => "Username",
		Cell: (data) => data.username,
	},
	{
		id: "password",
		Header: () => "Password",
		Cell: (data) => {
			const clipboard = useClipboard();

			return (
				<ActionIcon
					variant="subtle"
					color="gray"
					onClick={() => clipboard.copy(data.password)}
				>
					<IconCopy size={18} />
				</ActionIcon>
			);
		},
	},
	{
		id: "replies",
		Header: () => "Replies",
		Cell: (data) => data._count.leads,
	},
	{
		id: "errors",
		Header: () => "Errors",
		Cell: (data) => data._count.errors,
	},
	{
		id: "active",
		Header: () => "Active",
		Cell: (data) =>
			data.active ? (
				<IconCheck color="var(--mantine-color-green-5)" size={18} />
			) : (
				<IconX color="var(--mantine-color-red-5)" size={18} />
			),
	},
	{
		id: "controls",
		Header: () => null,
		Cell: (data) => {
			const [isOpen, { open, close }] = useDisclosure();
			return (
				<>
					<EditBotModal
						botId={data.id}
						modalProps={{ centered: true, opened: isOpen, onClose: close }}
					/>
					<Menu transitionProps={{ transition: "pop" }} withArrow>
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
				</>
			);
		},
	},
];

export default function BotsPage() {
	const params = useDataTableParams();
	const [isOpen, { open, close }] = useDisclosure();

	const getBotsQuery = trpc.admin.bots.getMany.useQuery({
		query: params.query ?? undefined,
		pagination: {
			page: params.page - 1,
			limit: params.limit,
		},
	});

	const getActiveCountsQuery = trpc.admin.bots.getActiveCounts.useQuery();

	return (
		<ResourceContainer title="Bots" subtitle="Manage and view all bots">
			<Flex justify="space-between" mb="xl">
				<Card>
					<Stack>
						<Text size="sm">Active bots</Text>
						<Group>
							<Group>
								<PlatformIcon
									platform="reddit"
									tooltip={true}
									height={24}
									width={24}
								/>
								<Text>{getActiveCountsQuery.data?.reddit ?? 0}</Text>
							</Group>
						</Group>
					</Stack>
				</Card>
				<Button onClick={open}>Create</Button>
			</Flex>
			<CreateBotModal opened={isOpen} onClose={close} />
			<DataTable
				data={getBotsQuery.data?.data ?? []}
				total={getBotsQuery.data?.total || 0}
				columns={columns}
				isLoading={getBotsQuery.isLoading}
				params={params}
				options={{
					noun: "bot",
				}}
			/>
		</ResourceContainer>
	);
}
