import { Link, type MetaFunction } from "@remix-run/react";
import { PlatformIcon } from "@components/platform-icon";
import { ResourceContainer } from "@components/resource-container";
import { useDataTableParams } from "@features/data-table/hooks/use-data-table-params";
import { trpc } from "@lib/trpc";
import { buildPageTitle } from "@lib/utils";
import { ActionIcon, Badge, Menu, Text, Tooltip } from "@mantine/core";
import { IconArrowRight, IconClock, IconDots } from "@tabler/icons-react";
import { useLocalProject } from "@features/projects/hooks/use-local-project";
import { RelativeDate } from "@components/relative-date";
import { getReplyStatusColor } from "@sweetreply/shared/features/leads/utils";
import { DataTable } from "@features/data-table/components/data-table";
import { ReplyStatus } from "@sweetreply/shared/features/leads/constants";
import type { SimpleTableColumns } from "@components/simple-table";
import type { RouterOutput } from "@server/router";

export const meta: MetaFunction = () => [{ title: buildPageTitle("Leads") }];

const columns: SimpleTableColumns<RouterOutput["leads"]["getMany"]["data"][0]> = [
	{
		id: "platform",
		Header: () => "Platform",
		Cell: (data) => (
			<PlatformIcon height={18} width={18} tooltip={true} platform={data.platform as any} />
		),
	},
	{
		id: "username",
		Header: () => "Username",
		Cell: (data) => data.username,
	},
	{
		id: "content",
		Header: () => "Content",
		Cell: (data) => (
			<Text size="sm" truncate="end" maw="300px">
				{data.content}
			</Text>
		),
	},
	{
		id: "date",
		Header: () => (
			<Tooltip label="Date">
				<IconClock size={18} />
			</Tooltip>
		),
		Cell: (data) => <RelativeDate size="sm" date={data.date} />,
	},
	{
		id: "reply_status",
		Header: () => "Reply status",
		Cell: (data) => (
			<Badge bg={getReplyStatusColor(data.reply_status)}>{data.reply_status || "none"}</Badge>
		),
	},
	{
		id: "controls",
		Header: () => null,
		Cell: (data) => (
			<Menu withArrow position="bottom-end" transitionProps={{ transition: "pop" }}>
				<Menu.Target>
					<ActionIcon variant="subtle" color="gray">
						<IconDots size={18} />
					</ActionIcon>
				</Menu.Target>
				<Menu.Dropdown>
					<Menu.Label>Actions</Menu.Label>
					<Menu.Item
						component={Link}
						to={data.id}
						leftSection={<IconArrowRight size={18} />}
					>
						View
					</Menu.Item>
					{data.remote_url && (
						<Menu.Item
							component="a"
							href={data.remote_url}
							target="_blank"
							leftSection={
								<PlatformIcon
									height={18}
									width={18}
									platform={data.platform as any}
								/>
							}
						>
							View on {data.platform}
						</Menu.Item>
					)}
				</Menu.Dropdown>
			</Menu>
		),
	},
];

export default function LeadsPage() {
	const [projectId] = useLocalProject();
	const params = useDataTableParams();

	const getLeadsQuery = trpc.leads.getMany.useQuery(
		{
			projectId: projectId,
			query: params.query ?? undefined,
			filter: {
				reply_status: params.getFilter("reply_status"),
			},
			pagination: {
				page: params.page - 1,
				limit: params.limit,
			},
		},
		{
			enabled: !!projectId,
		}
	);

	return (
		<ResourceContainer title="Leads" subtitle="View all of your leads and replies">
			<DataTable
				data={getLeadsQuery.data?.data ?? []}
				total={getLeadsQuery.data?.total || 0}
				columns={columns}
				isLoading={getLeadsQuery.isLoading}
				params={params}
				options={{
					noun: "lead",
				}}
				filters={[
					{
						name: "reply_status",
						label: "Reply status",
						type: "select",
						options: [
							ReplyStatus.REPLIED,
							ReplyStatus.SCHEDULED,
							ReplyStatus.FAILED,
							ReplyStatus.PENDING,
							ReplyStatus.REMOVING,
							ReplyStatus.DRAFT,
							ReplyStatus.NONE,
						],
					},
				]}
			/>
		</ResourceContainer>
	);
}
