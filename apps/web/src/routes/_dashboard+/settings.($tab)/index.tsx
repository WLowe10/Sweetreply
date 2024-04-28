import { useNavigate, useParams, type MetaFunction } from "@remix-run/react";
import { ResourceContainer } from "@components/resource-container";
import { buildPageTitle } from "@lib/utils";
import { Alert, Skeleton, Tabs } from "@mantine/core";
import { GeneralForm } from "./general-form";
import { SitesForm } from "./sites-form";
import { ReplyForm } from "./reply-form";
import { NotificationsForm } from "./notifications-form";
import { useCurrentProjectQuery } from "@features/projects/hooks/use-current-project-query";
import { IconAlertTriangle } from "@tabler/icons-react";

export const meta: MetaFunction = () => [{ title: buildPageTitle("Settings") }];

export default function SettingsPage() {
	const { tab } = useParams();
	const { data } = useCurrentProjectQuery();
	const navigate = useNavigate();

	return (
		<ResourceContainer title="Settings" subtitle="Manage your Sweetreply project">
			{!data ? (
				<Skeleton height={500} />
			) : (
				<>
					{(data.query === null || data.query.length === 0) && (
						<Alert
							variant="outline"
							color="red"
							mb="lg"
							title="Alert"
							icon={<IconAlertTriangle />}
						>
							You cannot monitor posts until you have configured a query
						</Alert>
					)}
					<Tabs
						value={tab}
						defaultValue="general"
						onChange={(value) => navigate(value ? `/settings/${value}` : "")}
					>
						<Tabs.List>
							<Tabs.Tab value="general">General</Tabs.Tab>
							<Tabs.Tab value="sites">Sites</Tabs.Tab>
							<Tabs.Tab value="reply">Reply</Tabs.Tab>
							<Tabs.Tab value="notifications">Notifications</Tabs.Tab>
						</Tabs.List>
						<Tabs.Panel value="general">
							<GeneralForm />
						</Tabs.Panel>
						<Tabs.Panel value="sites">
							<SitesForm />
						</Tabs.Panel>
						<Tabs.Panel value="reply">
							<ReplyForm />
						</Tabs.Panel>
						<Tabs.Panel value="notifications">
							<NotificationsForm />
						</Tabs.Panel>
					</Tabs>
				</>
			)}
		</ResourceContainer>
	);
}
