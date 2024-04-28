import { trpc } from "@lib/trpc";
import { ResourceContainer } from "@components/resource-container";
import { buildPageTitle } from "@lib/utils";
import { MetaFunction } from "@remix-run/react";
import { SimpleTableColumns } from "@components/simple-table";
import { DataTable } from "@features/data-table/components/data-table";
import { useDataTableParams } from "@features/data-table/hooks/use-data-table-params";
import type { RouterOutput } from "@server/router";

export const meta: MetaFunction = () => [{ title: buildPageTitle("Users", "Sweetreply Admin") }];

const columns: SimpleTableColumns<RouterOutput["admin"]["users"]["getMany"]["data"][0]> = [
	{
		id: "email",
		Header: () => "Email",
		Cell: (data) => data.email,
	},
	{
		id: "role",
		Header: () => "Role",
		Cell: (data) => data.role,
	},
	{
		id: "first_name",
		Header: () => "First name",
		Cell: (data) => data.first_name,
	},
	{
		id: "last_name",
		Header: () => "Last name",
		Cell: (data) => data.last_name,
	},
	{
		id: "sessions",
		Header: () => "Sessions",
		Cell: (data) => data._count.sessions,
	},
	{
		id: "registered",
		Header: () => "Registered",
		Cell: (data) => data.created_at.toDateString(),
	},
];

export default function UsersPage() {
	const params = useDataTableParams();

	const getUsersQuery = trpc.admin.users.getMany.useQuery({
		query: params.query ?? undefined,
		sort: {
			created_at: "desc",
		},
		pagination: {
			page: params.page - 1,
			limit: params.limit,
		},
	});

	const deleteSessionsMutation = trpc.admin.users.deleteSessions.useMutation();

	return (
		<ResourceContainer title="Users" subtitle="Manage and view all users">
			<DataTable
				data={getUsersQuery.data?.data ?? []}
				total={getUsersQuery.data?.total || 0}
				isLoading={getUsersQuery.isLoading}
				columns={columns}
				params={params}
				options={{
					noun: "user",
				}}
			/>
		</ResourceContainer>
	);
}
