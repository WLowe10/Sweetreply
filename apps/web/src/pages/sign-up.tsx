import { Card, TextInput, PasswordInput, Anchor, Button, Text, Stack, Alert } from "@mantine/core";
import { useForm } from "react-hook-form";
import { IconInfoCircle } from "@tabler/icons-react";
import { AuthPageLayout } from "@/layouts";
import { useDisclosure } from "@mantine/hooks";
import Link from "next/link";
import { z } from "zod";
import { signUpInputSchema } from "@sweetreply/shared/schemas/auth";
import { useSignUp } from "@/features/auth/hooks";
import { zodResolver } from "@hookform/resolvers/zod";

// this route should not be accessed if the user is already signed in

const signUpFormSchema = signUpInputSchema
	.extend({
		confirm_password: signUpInputSchema.shape.password,
	})
	.refine((data) => data.password === data.confirm_password, {
		path: ["confirm_password"],
		message: "Passwords do not match",
	});

export default function SignUpPage() {
	const { signUp, isLoading, isError, error } = useSignUp();

	const form = useForm<z.infer<typeof signUpFormSchema>>({
		resolver: zodResolver(signUpFormSchema),
	});

	const [visible, { toggle }] = useDisclosure(false);

	return (
		<AuthPageLayout
			pageTitle="Sign-up | SaaS.tools"
			title="Sign-up for an account"
			subtitle={
				<Text>
					Already have an account?{" "}
					<Anchor component={Link} href="/sign-in">
						Sign in
					</Anchor>
				</Text>
			}
		>
			<Card
				component="form"
				shadow="md"
				radius="md"
				p={30}
				withBorder
				onSubmit={form.handleSubmit(signUp)}
			>
				<Stack>
					<TextInput
						label="Email"
						placeholder="Your email"
						error={form.formState.errors.email?.message}
						required
						{...form.register("email", {
							required: true,
						})}
					/>
					<TextInput
						label="First name"
						placeholder="John"
						error={form.formState.errors.first_name?.message}
						required
						{...form.register("first_name", {
							required: true,
						})}
					/>
					<TextInput
						label="Last name"
						placeholder="Adams"
						error={form.formState.errors.last_name?.message}
						required
						{...form.register("last_name", {
							required: true,
						})}
					/>
					<PasswordInput
						label="Password"
						placeholder="Your password"
						required
						visible={visible}
						onVisibilityChange={toggle}
						error={form.formState.errors.password?.message}
						{...form.register("password", {
							required: true,
						})}
					/>
					<PasswordInput
						label="Confirm password"
						placeholder="Confirm password"
						required
						visible={visible}
						onVisibilityChange={toggle}
						error={form.formState.errors.confirm_password?.message}
						{...form.register("confirm_password", {
							required: true,
						})}
					/>
				</Stack>
				{isError && !isLoading && (
					<Alert mt="sm" color="red" icon={<IconInfoCircle />}>
						{error}
					</Alert>
				)}
				<Button type="submit" mt="xl" loading={isLoading} fullWidth>
					Sign up
				</Button>
			</Card>
		</AuthPageLayout>
	);
}
