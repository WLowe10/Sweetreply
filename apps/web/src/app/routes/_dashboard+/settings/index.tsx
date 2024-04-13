import type { MetaFunction } from "@remix-run/react";
import { ResourceContainer } from "@/components/resource-container";
import { buildPageTitle } from "@/lib/utils";
import { Tabs } from "@mantine/core";
import { GeneralForm } from "./general-form";
import { NotificationsForm } from "./notifications-form";

export const meta: MetaFunction = () => [{ title: buildPageTitle("Settings") }];

export default function DashboardPage() {
	return (
		<ResourceContainer title="Settings" subtitle="Manage your Sweetreply project">
			<Tabs defaultValue="general">
				<Tabs.List>
					<Tabs.Tab value="general">General</Tabs.Tab>
					<Tabs.Tab value="reddit">Reddit</Tabs.Tab>
					<Tabs.Tab value="notifications">Notifications</Tabs.Tab>
				</Tabs.List>
				<Tabs.Panel value="general">
					<GeneralForm />
				</Tabs.Panel>
				<Tabs.Panel value="reddit">
					<div />
				</Tabs.Panel>
				<Tabs.Panel value="notifications">
					<NotificationsForm />
				</Tabs.Panel>
			</Tabs>
		</ResourceContainer>
	);
}
