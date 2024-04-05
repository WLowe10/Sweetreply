import { DashboardLayout } from "@/layouts/dashboard";
import { VerifyAccountModal } from "@/features/auth/components";
import { useMe } from "@/features/auth/hooks";

export default function Dashboard() {
	const { me } = useMe();

	return (
		<DashboardLayout>
			Dashboard {me?.email}
			<VerifyAccountModal />
		</DashboardLayout>
	);
}
