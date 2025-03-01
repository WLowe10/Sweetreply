import { useMe } from "@features/auth/hooks/use-me";
import { useLocalProject } from "@features/projects/hooks/use-local-project";
import { ResourceContainer } from "@components/resource-container";
import { trpc } from "@lib/trpc";
import { buildPageTitle } from "utils";
import { SimpleGrid, Skeleton } from "@mantine/core";
import { IconCalendar, IconMessage, IconRadar } from "@tabler/icons-react";
import { StatCard } from "@components/stat-card";
import { useCurrentProjectQuery } from "@features/projects/hooks/use-current-project-query";
import type { MetaFunction } from "@remix-run/react";

export const meta: MetaFunction = () => [{ title: buildPageTitle("Dashboard") }];

export default function DashboardPage() {
	const { me } = useMe();
	const [projectId] = useLocalProject();
	const { data } = useCurrentProjectQuery();

	const getStatsQuery = trpc.projects.getStats.useQuery(
		{
			projectId: projectId,
		},
		{
			enabled: !!projectId,
		}
	);

	return data ? (
		<ResourceContainer title={data.name || ""} subtitle={me && `Welcome, ${me?.first_name}`}>
			<SimpleGrid cols={{ base: 1, md: 2 }}>
				{getStatsQuery.isLoading ? (
					<>
						<Skeleton height={200} />
						<Skeleton height={200} />
					</>
				) : (
					<>
						<StatCard
							title="Leads"
							value={getStatsQuery.data?.leads.count || 0}
							icon={IconRadar}
						/>
						<StatCard
							title="Replies"
							value={getStatsQuery.data?.replies.count || 0}
							icon={IconMessage}
						/>
						<StatCard
							title="Leads last 24 hours"
							value={getStatsQuery.data?.leads.last24HoursCount || 0}
							icon={IconRadar}
						/>
						<StatCard
							title="Replies last 24 hours"
							value={getStatsQuery.data?.replies.last24HoursCount || 0}
							icon={IconMessage}
						/>
						<StatCard
							title="Project Created"
							value={getStatsQuery.data?.project.created_at.toDateString() || ""}
							icon={IconCalendar}
						/>
					</>
				)}
			</SimpleGrid>
		</ResourceContainer>
	) : (
		<Skeleton height="100%" />
	);
}
