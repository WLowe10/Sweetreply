import { Link, useNavigate, useParams, type MetaFunction } from "@remix-run/react";
import { Alert, Anchor, List, Skeleton, Tabs } from "@mantine/core";
import { IconAlertTriangle } from "@tabler/icons-react";
import { useMe } from "@/features/auth/hooks/use-me";
import { useCurrentProjectQuery } from "@/features/projects/hooks/use-current-project-query";
import { useCurrentProjectIssues } from "@/features/projects/hooks/use-current-project-issues";
import { ResourceContainer } from "@/components/resource-container";
import { buildPageTitle } from "@/utils";
import { GeneralForm } from "./general-form";
import { SitesForm } from "./sites-form";
import { ReplyForm } from "./reply-form";
import { NotificationsForm } from "./notifications-form";

export const meta: MetaFunction = () => [{ title: buildPageTitle("Settings") }];

export default function SettingsPage() {
	const { tab } = useParams();
	const { data } = useCurrentProjectQuery();
	const { isSubscribed } = useMe();
	const issues = useCurrentProjectIssues();
	const navigate = useNavigate();

	return (
		<ResourceContainer title="Settings" subtitle="Manage your Sweetreply project">
			{!data ? (
				<Skeleton height={500} />
			) : (
				<>
					{(issues.length > 0 || !isSubscribed) && (
						<Alert
							variant="default"
							color="red"
							mb="lg"
							title="Alert"
							icon={<IconAlertTriangle color="var(--mantine-color-red-5)" />}
						>
							<List>
								{!isSubscribed && (
									<List.Item>
										You cannot make replies until you{" "}
										<Anchor component={Link} to="/billing">
											subscribe
										</Anchor>
									</List.Item>
								)}
								{issues.map((issue, idx) => (
									<List.Item key={idx}>{issue}</List.Item>
								))}
							</List>
						</Alert>
					)}
					<Tabs
						value={tab}
						defaultValue="general"
						onChange={value => navigate(value ? `/settings/${value}` : "")}
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
