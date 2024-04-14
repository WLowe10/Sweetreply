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
import type { MetaFunction } from "@remix-run/react";

export const meta: MetaFunction = () => [{ title: buildPageTitle("Forgot password") }];

export default function ForgotPasswordPage() {
	const isError = false;
	const error = "";
	const isLoading = false;

	const form = useForm<ForgotPasswordInputType>({
		resolver: zodResolver(forgotPasswordInputSchema),
	});

	return (
		<AuthFormContainer
			title="Forgot password"
			subtitle={"Enter your email and we'll send you a link to reset your password"}
		>
			<Card shadow="md" radius="md" p={30} withBorder>
				<form onSubmit={form.handleSubmit(() => {})}>
					<Stack>
						<TextInput
							label="Email"
							placeholder="Your email"
							error={form.formState.errors.email?.message}
							{...form.register("email")}
						/>
					</Stack>
				</form>
				{isError && !isLoading && (
					<Alert mt="sm" color="red" icon={<IconInfoCircle />}>
						{error}
					</Alert>
				)}
				<Button type="submit" mt="xl" loading={isLoading} fullWidth>
					Reset password
				</Button>
			</Card>
		</AuthFormContainer>
	);
}
