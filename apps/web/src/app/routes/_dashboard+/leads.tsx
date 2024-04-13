import { DataTable } from "@/components/data-table";
import { PlatformIcon } from "@/components/platform-icon";
import { ResourceContainer } from "@/components/resource-container";
import { useDataTableParams } from "@/hooks/use-data-table-params";
import { trpc } from "@/lib/trpc";
import { buildPageTitle } from "@/lib/utils";
import { ActionIcon, Flex, Menu, Skeleton, Table, Text } from "@mantine/core";
import { IconDots } from "@tabler/icons-react";
import type { MetaFunction } from "@remix-run/react";

export const meta: MetaFunction = () => [{ title: buildPageTitle("Leads") }];

const Row = (lead: any) => {
	return (
		<Table.Tr>
			<Table.Td>
				<Flex align="center">
					<PlatformIcon platform={lead.platform} tooltip={true} height={18} width={18} />
				</Flex>
			</Table.Td>
			<Table.Td>{lead.username}</Table.Td>
			<Table.Td>
				<Text size="sm" truncate="end" maw="300px">
					{lead.content}
				</Text>
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
						{lead.remote_url && (
							<Menu.Item component="a" href={lead.remote_url} target="_blank">
								View on {lead.platform}
							</Menu.Item>
						)}
					</Menu.Dropdown>
				</Menu>
			</Table.Td>
		</Table.Tr>
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
		</Table.Tr>
	);
};

export default function LeadsPage() {
	const params = useDataTableParams();

	const getBotsQuery = trpc.leads.getMany.useQuery({
		query: params.query ?? undefined,
		pagination: {
			page: params.page - 1,
			limit: params.limit,
		},
	});

	return (
		<ResourceContainer title="Leads" subtitle="View all of your leads and replies">
			<DataTable
				data={getBotsQuery.data?.data ?? []}
				searchPlaceholder="Search leads"
				total={getBotsQuery.data?.total || 0}
				params={params}
				isLoading={getBotsQuery.isLoading}
				header={
					<Table.Thead>
						<Table.Tr>
							<Table.Th>Platform</Table.Th>
							<Table.Th>Username</Table.Th>
							<Table.Th>Content</Table.Th>
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
