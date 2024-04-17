import { Card, Stack, TextInput, PasswordInput, Alert, Button } from "@mantine/core";
import { useForm } from "react-hook-form";
import { AuthFormContainer } from "@/features/auth/components/auth-form-container";
import { zodResolver } from "@hookform/resolvers/zod";
import { IconInfoCircle } from "@tabler/icons-react";
import {
	changePasswordInputSchema,
	type ChangePasswordInputType,
} from "@sweetreply/shared/features/auth/schemas";
import { buildPageTitle } from "@/lib/utils";
import type { MetaFunction } from "@remix-run/react";

export const meta: MetaFunction = () => [{ title: buildPageTitle("Change password") }];

export default function ChangePasswordPage() {
	// const { changePassword } = useChangePassword

	const isError = false;
	const isLoading = false;
	const error = "";

	const form = useForm<ChangePasswordInputType>({
		resolver: zodResolver(changePasswordInputSchema),
	});

	return (
		<AuthFormContainer title="Change password" subtitle={"Enter your new password"}>
			<Card shadow="md" radius="md" p={30} withBorder>
				<form onSubmit={form.handleSubmit(() => {})}>
					<Stack>
						<TextInput
							label="Password"
							placeholder="Your new password"
							error={form.formState.errors.new_password?.message}
							{...form.register("new_password")}
						/>
					</Stack>
				</form>
				{isError && !isLoading && (
					<Alert mt="sm" color="red" icon={<IconInfoCircle />}>
						{error}
					</Alert>
				)}
				<Button type="submit" mt="xl" loading={isLoading} fullWidth>
					Change password
				</Button>
			</Card>
		</AuthFormContainer>
	);
}
