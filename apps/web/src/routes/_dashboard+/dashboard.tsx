import { ResourceContainer } from "@/components/resource-container";
import { useMe } from "@/features/auth/hooks";
import { useLocalProject } from "@/features/projects/hooks/use-local-project";
import { trpc } from "@/lib/trpc";
import { buildPageTitle } from "@/lib/utils";
import { Card, Center, SimpleGrid, Skeleton, Stack, Text, Title } from "@mantine/core";
import { formatRelative } from "date-fns";
import type { MetaFunction } from "@remix-run/react";

export const meta: MetaFunction = () => [{ title: buildPageTitle("Dashboard") }];

export default function DashboardPage() {
	const { me } = useMe();
	const [projectId] = useLocalProject();

	const getStatsQuery = trpc.projects.getStats.useQuery(
		{
			projectId: projectId,
		},
		{
			enabled: !!projectId,
		}
	);

	return (
		<ResourceContainer title="Dashboard" subtitle={me && `Welcome, ${me?.first_name}`}>
			<SimpleGrid cols={{ base: 1, md: 2 }}>
				{getStatsQuery.isLoading ? (
					<>
						<Skeleton height={200} />
						<Skeleton height={200} />
					</>
				) : (
					<>
						<Card>
							<Title order={3}>Leads</Title>
							<Center p="2rem">
								<Text size="3rem" fw="bold">
									{getStatsQuery.data?.leads.count}
								</Text>
							</Center>
							{getStatsQuery.data?.leads.mostRecent && (
								<Text>
									Most recent lead{" "}
									{formatRelative(
										getStatsQuery.data?.leads.mostRecent,
										new Date()
									)}
								</Text>
							)}
						</Card>
						<Card>
							<Title order={3}>Replies</Title>
							<Center p="2rem">
								<Text size="3rem" fw="bold">
									{getStatsQuery.data?.replies.count}
								</Text>
							</Center>
							{getStatsQuery.data?.replies.mostRecent && (
								<Text>
									Most recent reply{" "}
									{formatRelative(
										getStatsQuery.data?.replies.mostRecent,
										new Date()
									)}
								</Text>
							)}
						</Card>
					</>
				)}
			</SimpleGrid>
		</ResourceContainer>
	);
}
