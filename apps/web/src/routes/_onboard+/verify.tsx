import { useMe } from "@/features/auth/hooks/use-me";
import { ProfileModal } from "@/features/auth/components/profile-modal";
import { useEffect } from "react";
import { MetaFunction, useNavigate } from "@remix-run/react";
import { buildPageTitle } from "@/lib/utils";

export const meta: MetaFunction = () => [{ title: buildPageTitle("Verify Your Account") }];

export default function VerifyPage() {
	const navigate = useNavigate();
	const { me } = useMe();

	useEffect(() => {
		if (me?.verified_at) {
			navigate("/onboard");
		}
	}, [me]);

	return (
		<ProfileModal
			modalProps={{ opened: true, centered: true, withCloseButton: false, onClose: () => {} }}
		/>
	);
}
