import { useForm } from "react-hook-form";
import { TextInput, PasswordInput, Group, Anchor, Button, Card, Text, Stack, Alert } from "@mantine/core";
import { IconInfoCircle } from "@tabler/icons-react";
import { AuthPageLayout } from "@/layouts";
import Link from "next/link";

// this route should not be accessed if the user is already signed in

export default function SignInPage() {
	// const { signIn, isLoading, error } = useSignIn();
	const signIn = () => {};
	const isLoading = false;
	const error = "";

	const { register, handleSubmit } = useForm({
		defaultValues: {
			email: "",
			password: "",
		},
	});

	return (
		<AuthPageLayout pageTitle="Sign in | SaaS.tools" title="Sign-in to your account" subtitle={<Subtitle />}>
			<Card component="form" withBorder shadow="md" radius="md" p={30} onSubmit={handleSubmit(signIn)}>
				<Stack>
					<TextInput
						label="Email"
						placeholder="Your email"
						required
						{...register("email", {
							required: true,
						})}
					/>
					<PasswordInput
						label="Password"
						placeholder="Your password"
						required
						{...register("password", {
							required: true,
						})}
					/>
					<Group justify="space-between">
						<Anchor component={Link} href="/forgot-password" size="sm">
							Forgot password?
						</Anchor>
					</Group>
				</Stack>
				{error && !isLoading && (
					<Alert mt="sm" color="red" icon={<IconInfoCircle />}>
						{error}
					</Alert>
				)}
				<Button type="submit" mt="xl" fullWidth loading={isLoading}>
					Sign in
				</Button>
			</Card>
		</AuthPageLayout>
	);
}

const Subtitle = () => {
	return (
		<Text>
			Don't have an account?{" "}
			<Anchor component={Link} href="/sign-up">
				Sign up
			</Anchor>
		</Text>
	);
};
