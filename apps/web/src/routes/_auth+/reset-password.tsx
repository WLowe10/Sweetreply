import { Card, Stack, TextInput, PasswordInput, Alert, Button } from "@mantine/core";
import { useForm } from "react-hook-form";
import { AuthFormContainer } from "@features/auth/components/auth-form-container";
import { zodResolver } from "@hookform/resolvers/zod";
import { IconInfoCircle } from "@tabler/icons-react";
import { changePasswordInputSchema } from "@sweetreply/shared/features/auth/schemas";
import { buildPageTitle } from "@lib/utils";
import { useResetPassword } from "@features/auth/hooks/use-reset-password";
import { useDisclosure } from "@mantine/hooks";
import { z } from "zod";
import type { MetaFunction } from "@remix-run/react";

export const meta: MetaFunction = () => [{ title: buildPageTitle("Change password") }];

const changePasswordFormSchema = changePasswordInputSchema
	.pick({
		new_password: true,
	})
	.extend({
		confirm_password: changePasswordInputSchema.shape.new_password,
	})
	.refine((data) => data.new_password === data.confirm_password, {
		path: ["confirm_password"],
		message: "Passwords do not match",
	});

export default function ResetPasswordPage() {
	const { resetPassword, isLoading, isError, error } = useResetPassword();
	const [visible, { toggle }] = useDisclosure(false);

	const form = useForm<z.infer<typeof changePasswordFormSchema>>({
		resolver: zodResolver(changePasswordFormSchema),
	});

	const handleSubmit = form.handleSubmit(({ new_password }) => {
		resetPassword(new_password);
	});

	return (
		<AuthFormContainer title="Reset password" subtitle={"Enter your new password"}>
			<Card shadow="md" radius="md" p={30} withBorder>
				<form onSubmit={handleSubmit}>
					<Stack>
						<PasswordInput
							label="Password"
							placeholder="Your new password"
							error={form.formState.errors.new_password?.message}
							visible={visible}
							onVisibilityChange={toggle}
							{...form.register("new_password")}
						/>
						<PasswordInput
							label="Confirm password"
							placeholder="Your new password"
							error={form.formState.errors.new_password?.message}
							visible={visible}
							onVisibilityChange={toggle}
							{...form.register("confirm_password")}
						/>
						{isError && !isLoading && (
							<Alert mt="sm" color="red" icon={<IconInfoCircle />}>
								{error}
							</Alert>
						)}
						<Button type="submit" loading={isLoading} fullWidth>
							Change password
						</Button>
					</Stack>
				</form>
			</Card>
		</AuthFormContainer>
	);
}
