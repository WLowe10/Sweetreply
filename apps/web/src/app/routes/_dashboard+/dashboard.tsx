import { ResourceContainer } from "@/components/resource-container";
import { buildPageTitle } from "@/lib/utils";
import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => [{ title: buildPageTitle("Settings") }];

export default function DashboardPage() {
	return <ResourceContainer title="Dashboard">dashboard</ResourceContainer>;
}
