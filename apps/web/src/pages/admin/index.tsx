import { useMe } from "@/features/auth/hooks";
import { trpc } from "@/lib/trpc";
import { Sparkline } from "@mantine/charts";

// obviously add auth checks here

export default function AdminDashboardPage() {
	const { me } = useMe();
	const getStatsQuery = trpc.admin.getStats.useQuery();

	return (
		<div>
			<div>Admin</div>
			<div>hello {me?.first_name}</div>
			{/* <Sparkline
				w={200}
				h={60}
				data={getStatsQuery.data?.users.chart.map((val) => Number(val.signup_count)) || []}
				curveType="linear"
				color="blue"
				fillOpacity={0.6}
				strokeWidth={2}
			/> */}
		</div>
	);
}
