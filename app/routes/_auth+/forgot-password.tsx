import { Card, Stack, TextInput, PasswordInput, Alert, Button, Center, Text } from "@mantine/core";
import { useForm } from "react-hook-form";
import { AuthFormContainer } from "@/features/auth/components/auth-form-container";
import { zodResolver } from "@hookform/resolvers/zod";
import { ForgotPasswordInputType, forgotPasswordInputSchema } from "~/features/auth/schemas";
import { buildPageTitle } from "@/utils";
import { useNavigate, type MetaFunction } from "@remix-run/react";
import { useEffect, useState } from "react";
import { useMe } from "@/features/auth/hooks/use-me";
import { trpc } from "@/lib/trpc";
import { notifications } from "@mantine/notifications";
import { IconCircleCheck } from "@tabler/icons-react";

export const meta: MetaFunction = () => [{ title: buildPageTitle("Forgot password") }];

export default function ForgotPasswordPage() {
	const navigate = useNavigate();
	const [submitted, setSubmitted] = useState(false);
	const { isAuthenticated } = useMe();

	const forgotPassswordMutation = trpc.auth.forgotPassword.useMutation();

	const form = useForm<ForgotPasswordInputType>({
		resolver: zodResolver(forgotPasswordInputSchema),
	});

	const onSubmit = form.handleSubmit(data => {
		forgotPassswordMutation.mutate(data, {
			onSuccess: () => {
				setSubmitted(true);
			},
			onError: () => {
				notifications.show({
					title: "Failed to send reset password email",
					message: "Please try again later",
					color: "red",
				});
			},
		});
	});

	useEffect(() => {
		if (isAuthenticated) {
			navigate("/dashboard");
		}
	}, [isAuthenticated]);

	return (
		<AuthFormContainer
			title="Forgot password"
			subtitle={"Enter your email and we'll send you a link to reset your password"}
		>
			<Card shadow="md" radius="md" p={30} withBorder>
				{submitted ? (
					<Center>
						<Stack gap="sm" align="center" ta="center">
							<IconCircleCheck color="var(--mantine-color-blue-5)" />
							<Text>We've sent a password reset link to</Text>
							<Text c="dimmed" fw="bold">
								{form.getValues().email}
							</Text>
							<Text>
								You should receive an email with a link to reset your password.
							</Text>
						</Stack>
					</Center>
				) : (
					<form onSubmit={onSubmit}>
						<Stack>
							<TextInput
								label="Email"
								placeholder="Your email"
								error={form.formState.errors.email?.message}
								{...form.register("email")}
							/>
							<Button
								type="submit"
								loading={forgotPassswordMutation.isLoading}
								fullWidth
							>
								Reset password
							</Button>
						</Stack>
					</form>
				)}
			</Card>
		</AuthFormContainer>
	);
}
