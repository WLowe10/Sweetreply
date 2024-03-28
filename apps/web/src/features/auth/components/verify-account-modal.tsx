import { Button, Modal, Stack, Text, Title } from "@mantine/core";
import { useMe } from "../hooks";
import Link from "next/link";
import { useRequestVerification } from "../hooks/use-request-verification";

export const VerifyAccountModal = () => {
	const { me } = useMe();
	const { requestVerification } = useRequestVerification();

	if (!me) return null;

	return (
		<Modal
			centered={true}
			padding="lg"
			title={<Title order={3}>👋 Verify your account</Title>}
			overlayProps={{
				backgroundOpacity: 0.55,
				blur: 3,
			}}
			opened={!me.verified_at}
			onClose={() => {}}
		>
			<Stack>
				<Text>
					Hello {me.first_name},
					<br />
					Please verify your account to access all features
				</Text>
				<Button fullWidth>Send verification</Button>
				<Button fullWidth color="dark" component={Link} href="/profile">
					View profile
				</Button>
			</Stack>
		</Modal>
	);
};
