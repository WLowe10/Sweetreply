import { DataTable } from "@/components/data-table";
import { ResourceContainer } from "@/components/resource-container";
import { buildPageTitle } from "@/lib/utils";
import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => [{ title: buildPageTitle("Leads") }];

export default function LeadsPage() {
	return (
		<ResourceContainer title="Leads" subtitle="View all of your leads and replies">
			<DataTable />
		</ResourceContainer>
	);
}
