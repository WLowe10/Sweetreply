import { VerifyAccountModal } from "@/features/auth/components";
import { useMe } from "@/features/auth/hooks";

export default function Dashboard() {
	const { me } = useMe();

	return (
		<div>
			Dashboard {me?.email}
			<VerifyAccountModal />
		</div>
	);
}
