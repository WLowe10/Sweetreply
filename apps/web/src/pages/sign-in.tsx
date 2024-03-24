import { useForm } from "react-hook-form";
import { TextInput, PasswordInput, Group, Anchor, Button, Card, Text, Stack, Alert } from "@mantine/core";
import { IconInfoCircle } from "@tabler/icons-react";
import { AuthPageLayout } from "@/layouts";
import { trpc } from "@/lib/trpc";
import { signInInputSchema } from "@replyon/shared/schemas/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import z from "zod";
import { useMe } from "@/features/auth/hooks";
// this route should not be accessed if the user is already signed in

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

export default function SignInPage() {
	// useMe({
	// 	redirect: {
	// 		to: "/pricing",
	// 		when: {
	// 			isAuthenticated: true,
	// 		},
	// 	},
	// });

	const signInMutation = trpc.auth.signIn.useMutation();

	const form = useForm<z.infer<typeof signInInputSchema>>({
		resolver: zodResolver(signInInputSchema),
	});

	const handleSubmit = form.handleSubmit((data) => {
		signInMutation.mutate(
			{
				email: data.email,
				password: data.password,
			},
			{
				onSuccess: () => {},
			}
		);
	});

	return (
		<AuthPageLayout pageTitle="Sign in | SaaS.tools" title="Sign-in to your account" subtitle={<Subtitle />}>
			<Card component="form" withBorder shadow="md" radius="md" p={30} onSubmit={handleSubmit}>
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
					<PasswordInput
						label="Password"
						placeholder="Your password"
						error={form.formState.errors.password?.message}
						required
						{...form.register("password", {
							required: true,
						})}
					/>
					<Group justify="space-between">
						<Anchor component={Link} href="/forgot-password" size="sm">
							Forgot password?
						</Anchor>
					</Group>
				</Stack>
				{signInMutation.error && !signInMutation.isLoading && (
					<Alert mt="sm" color="red" icon={<IconInfoCircle />}>
						{errors.signIn}
					</Alert>
				)}
				<Button type="submit" mt="xl" fullWidth loading={signInMutation.isLoading}>
					Sign in
				</Button>
			</Card>
		</AuthPageLayout>
	);
}
