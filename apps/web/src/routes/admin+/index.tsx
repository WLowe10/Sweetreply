import { ResourceContainer } from "@/components/resource-container";
import { StatCard } from "@/components/stat-card";
import { useMe } from "@/features/auth/hooks";
import { trpc } from "@/lib/trpc";
import { Sparkline } from "@mantine/charts";
import { Box, SimpleGrid, Skeleton } from "@mantine/core";
import { Link } from "@remix-run/react";
import {
	IconRadar,
	IconMessage,
	IconCoin,
	IconCalendar,
	IconUser,
	IconBox,
	IconRobotFace,
} from "@tabler/icons-react";

// obviously add auth checks here

export default function AdminDashboardPage() {
	const { me } = useMe();
	const getStatsQuery = trpc.admin.getStats.useQuery();

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
						<Link to="users" style={{ textDecoration: "none", color: "inherit" }}>
							<StatCard
								title="Users"
								value={getStatsQuery.data?.users.count || 0}
								icon={IconUser}
							/>
						</Link>
						<Link to="projects" style={{ textDecoration: "none", color: "inherit" }}>
							<StatCard
								title="Projects"
								value={getStatsQuery.data?.projects.count || 0}
								icon={IconBox}
							/>
						</Link>
						<Link to="bots" style={{ textDecoration: "none", color: "inherit" }}>
							<StatCard
								title="Bots"
								value={getStatsQuery.data?.bots.count || 0}
								icon={IconRobotFace}
							/>
						</Link>
					</>
				)}
			</SimpleGrid>
		</ResourceContainer>
	);
}
