import { AuthFormContainer } from "@features/auth/components/auth-form-container";
import { buildPageTitle } from "@lib/utils";
import { useNavigate, useSearchParams, type MetaFunction } from "@remix-run/react";
import { useMe } from "@features/auth/hooks/use-me";
import { trpc } from "@lib/trpc";
import { notifications } from "@mantine/notifications";
import { useEffect, useState } from "react";
import { Button, Card, Center, Stack, Text } from "@mantine/core";
import { IconCircleCheck } from "@tabler/icons-react";

export const meta: MetaFunction = () => [{ title: buildPageTitle("Verify your account") }];

export default function VerifyPage() {
	const navigate = useNavigate();
	const { me, isAuthenticated, isInitialized } = useMe();
	const [searchParams] = useSearchParams();
	const [submitted, setSubmitted] = useState(false);

	const trpcUtils = trpc.useUtils();

	const verifyAccountMutation = trpc.auth.verifyAccount.useMutation();
	const requestVerificationMutation = trpc.auth.requestVerification.useMutation();

	const requestVerification = () => {
		requestVerificationMutation.mutate(undefined, {
			onSuccess: () => {
				setSubmitted(true);
			},
			onError: (err) => {
				notifications.show({
					title: "Failed to request send verification",
					message: err.message,
					color: "red",
				});
			},
		});
	};

	const token = searchParams.get("token");

	useEffect(() => {
		if (me?.verified_at) {
			navigate("/dashboard");
		}
	}, [me]);

	useEffect(() => {
		if (isInitialized && !isAuthenticated) {
			navigate("/");
		}
	}, [isAuthenticated, isInitialized]);

	useEffect(() => {
		if (token) {
			verifyAccountMutation.mutate(
				{
					token,
				},
				{
					onSuccess: ({ verified_at }) => {
						notifications.show({
							title: "Account verified",
							message: "You can now continue to your dashboard",
						});
					},
					onError: (err) => {
						notifications.show({
							title: "Verification failed",
							message: err.message,
							color: "red",
						});
					},
				}
			);
		}
	}, [token, isAuthenticated]);

	return (
		<AuthFormContainer
			title="Verify your account"
			subtitle={me ? `A verification email has been sent to ${me.email}` : ""}
		>
			{submitted ? (
				<Card shadow="md" radius="md" p={30} withBorder>
					<Center>
						<Stack gap="sm" align="center" ta="center">
							<IconCircleCheck color="var(--mantine-color-blue-5)" />
							<Text>We've sent a verification email to</Text>
							<Text c="dimmed" fw="bold">
								{me?.email}
							</Text>
							<Text>
								You should receive an email with a link to verify your account.
							</Text>
						</Stack>
					</Center>
				</Card>
			) : (
				<Button
					fullWidth
					loading={requestVerificationMutation.isLoading}
					onClick={requestVerification}
				>
					Resend verification email
				</Button>
			)}
		</AuthFormContainer>
	);
}
