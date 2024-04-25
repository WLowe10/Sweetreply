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
import { useNavigate, type MetaFunction } from "@remix-run/react";
import { useForgotPassword } from "@/features/auth/hooks/use-forgot-password";
import { useEffect } from "react";
import { useMe } from "@/features/auth/hooks/use-me";

export const meta: MetaFunction = () => [{ title: buildPageTitle("Forgot password") }];

export default function ForgotPasswordPage() {
	const navigate = useNavigate();
	const { isAuthenticated } = useMe();
	const { forgotPassword, isLoading } = useForgotPassword();

	const form = useForm<ForgotPasswordInputType>({
		resolver: zodResolver(forgotPasswordInputSchema),
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
				<form onSubmit={form.handleSubmit(forgotPassword)}>
					<Stack>
						<TextInput
							label="Email"
							placeholder="Your email"
							error={form.formState.errors.email?.message}
							{...form.register("email")}
						/>
						<Button type="submit" loading={isLoading} fullWidth>
							Reset password
						</Button>
					</Stack>
				</form>
			</Card>
		</AuthFormContainer>
	);
}
