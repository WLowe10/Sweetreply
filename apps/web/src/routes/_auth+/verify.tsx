import { Card, Stack, TextInput, PasswordInput, Alert, Button } from "@mantine/core";
import { useForm } from "react-hook-form";
import { AuthFormContainer } from "@/features/auth/components/auth-form-container";
import { zodResolver } from "@hookform/resolvers/zod";
import { IconInfoCircle } from "@tabler/icons-react";
import {
	ForgotPasswordInputType,
	forgotPasswordInputSchema,
} from "@sweetreply/shared/features/auth/schemas";
import { buildPageTitle } from "@/lib/utils";
import { useNavigate, useSearchParams, type MetaFunction } from "@remix-run/react";
import { useMe } from "@/features/auth/hooks/use-me";
import { trpc } from "@/lib/trpc";
import { notifications } from "@mantine/notifications";
import { useEffect } from "react";

export const meta: MetaFunction = () => [{ title: buildPageTitle("Verify your account") }];

export default function VerifyPage() {
	const navigate = useNavigate();
	const { me, isAuthenticated, isInitialized } = useMe();
	const [searchParams] = useSearchParams();

	const verifyAccountMutation = trpc.auth.verifyAccount.useMutation();
	const requestVerificationMutation = trpc.auth.requestVerification.useMutation();

	const requestVerification = () => {
		requestVerificationMutation.mutate(undefined, {
			onSuccess: () => {
				notifications.show({
					title: "Verification email sent",
					message: "Make sure to check your spam",
				});
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
					onSuccess: () => {
						notifications.show({
							title: "Account verified",
							message: "You can now use the app",
						});

						navigate("/dashboard");
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
	}, [token]);

	return (
		<AuthFormContainer
			title="Verify your account"
			subtitle={me ? `A verification email has been sent to ${me.email}` : ""}
		>
			<Button
				fullWidth
				loading={requestVerificationMutation.isLoading}
				onClick={requestVerification}
			>
				Resend verification email
			</Button>
		</AuthFormContainer>
	);
}
