import { DashboardLayout } from "@/layouts/dashboard";
import { useCurrentTeamQuery } from "@/features/team/hooks/use-current-team";
import { Box, Title } from "@mantine/core";
import { ResourceLayout } from "@/layouts/resource";

const Page = () => {
	const { data: team } = useCurrentTeamQuery();

	return <Box flex={1}>test</Box>;
};

export default function DashboardPage() {
	return (
		<DashboardLayout>
			<ResourceLayout>
				<Page />
			</ResourceLayout>
		</DashboardLayout>
	);
}
