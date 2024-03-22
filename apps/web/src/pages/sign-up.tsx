import { Card, TextInput, PasswordInput, Anchor, Button, Text, Stack, Alert } from "@mantine/core";
import { useForm } from "react-hook-form";
import { IconInfoCircle } from "@tabler/icons-react";
import { AuthPageLayout } from "@/layouts";
import { useDisclosure } from "@mantine/hooks";
import Link from "next/link";

// this route should not be accessed if the user is already signed in

type SignUpData = any & { password_confirm: string };

export default function SignUpPage() {
	const signUp = () => {};
	const isLoading = false;
	const error = "";
	// const { signUp, isLoading, error } = useSignUp();
	const { register, handleSubmit } = useForm<SignUpData>();
	const [visible, { toggle }] = useDisclosure(false);

	//!todo validate

	return (
		<AuthPageLayout pageTitle="Sign-up | SaaS.tools" title="Sign-up for an account" subtitle={<Subtitle />}>
			<Card component="form" shadow="md" radius="md" p={30} withBorder onSubmit={handleSubmit(signUp)}>
				<Stack>
					<TextInput
						label="Email"
						placeholder="Your email"
						required
						{...register("email", {
							required: true,
						})}
					/>
					<TextInput
						label="First name"
						placeholder="John"
						required
						{...register("first_name", {
							required: true,
						})}
					/>
					<TextInput
						label="Last name"
						placeholder="Adams"
						required
						{...register("last_name", {
							required: true,
						})}
					/>
					<PasswordInput
						label="Password"
						placeholder="Your password"
						required
						visible={visible}
						onVisibilityChange={toggle}
						{...register("password", {
							required: true,
						})}
					/>
					<PasswordInput
						label="Confirm password"
						placeholder="Confirm password"
						required
						visible={visible}
						onVisibilityChange={toggle}
						{...register("password_confirm", {
							required: true,
						})}
					/>
				</Stack>
				{error && !isLoading && (
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

const Subtitle = () => {
	return (
		<Text>
			Already have an account?{" "}
			<Anchor component={Link} href="/sign-in">
				Sign in
			</Anchor>
		</Text>
	);
};
