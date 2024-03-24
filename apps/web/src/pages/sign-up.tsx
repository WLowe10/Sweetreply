import { Card, TextInput, PasswordInput, Anchor, Button, Text, Stack, Alert } from "@mantine/core";
import { useForm } from "react-hook-form";
import { IconInfoCircle } from "@tabler/icons-react";
import { AuthPageLayout } from "@/layouts";
import { useDisclosure } from "@mantine/hooks";
import { trpc } from "@/lib/trpc";
import Link from "next/link";
import { z } from "zod";
import { signUpInputSchema } from "@replyon/shared/schemas/auth";

// this route should not be accessed if the user is already signed in

// make sure confirm password matches password

const signUpFormSchema = signUpInputSchema.extend({
	confirm_password: signUpInputSchema.shape.password,
});

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

export default function SignUpPage() {
	const signUpMutation = trpc.auth.signUp.useMutation();
	const form = useForm<z.infer<typeof signUpFormSchema>>();
	const [visible, { toggle }] = useDisclosure(false);

	const handleSignUp = form.handleSubmit((data) => {
		signUpMutation.mutate({
			email: data.email,
			first_name: data.first_name,
			last_name: data.last_name,
			password: data.password,
		});
	});

	return (
		<AuthPageLayout pageTitle="Sign-up | SaaS.tools" title="Sign-up for an account" subtitle={<Subtitle />}>
			<Card component="form" shadow="md" radius="md" p={30} withBorder onSubmit={handleSignUp}>
				<Stack>
					<TextInput
						label="Email"
						placeholder="Your email"
						required
						{...form.register("email", {
							required: true,
						})}
					/>
					<TextInput
						label="First name"
						placeholder="John"
						required
						{...form.register("first_name", {
							required: true,
						})}
					/>
					<TextInput
						label="Last name"
						placeholder="Adams"
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
						{...form.register("confirm_password", {
							required: true,
						})}
					/>
				</Stack>
				{signUpMutation.error && !signUpMutation.isLoading && (
					<Alert mt="sm" color="red" icon={<IconInfoCircle />}>
						{signUpMutation.error.message}
					</Alert>
				)}
				<Button type="submit" mt="xl" loading={signUpMutation.isLoading} fullWidth>
					Sign up
				</Button>
			</Card>
		</AuthPageLayout>
	);
}
