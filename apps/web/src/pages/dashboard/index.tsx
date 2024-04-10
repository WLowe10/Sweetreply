import { DashboardLayout } from "@/layouts/dashboard";
import { ResourceLayout } from "@/layouts/resource";

export default function DashboardPage() {
	return (
		<DashboardLayout>
			<ResourceLayout>
				<div>Dashboard</div>
			</ResourceLayout>
		</DashboardLayout>
	);
}
