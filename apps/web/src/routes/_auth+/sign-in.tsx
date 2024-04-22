import { Link, type MetaFunction } from "@remix-run/react";
import { useForm } from "react-hook-form";
import {
	TextInput,
	PasswordInput,
	Group,
	Anchor,
	Button,
	Card,
	Text,
	Stack,
	Alert,
	Flex,
} from "@mantine/core";
import { IconInfoCircle } from "@tabler/icons-react";
import { signInInputSchema, type SignInInputType } from "@sweetreply/shared/features/auth/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSignIn } from "@/features/auth/hooks/use-sign-in";
import { AuthFormContainer } from "@/features/auth/components/auth-form-container";
import { buildPageTitle } from "@/lib/utils";

export const meta: MetaFunction = () => [{ title: buildPageTitle("Sign-in") }];

// this route should not be accessed if the user is already signed in
export default function SignInPage() {
	const { signIn, isLoading, isError, error } = useSignIn();

	const form = useForm<SignInInputType>({
		resolver: zodResolver(signInInputSchema),
	});

	return (
		<AuthFormContainer
			title="Sign-in to your account"
			subtitle={
				<Text>
					Don't have an account?{" "}
					<Anchor component={Link} to="/sign-up">
						Sign up
					</Anchor>
				</Text>
			}
		>
			<Card withBorder shadow="md" radius="md" p={30}>
				<form onSubmit={form.handleSubmit(signIn)}>
					<Stack>
						<TextInput
							label="Email"
							placeholder="Your email"
							error={form.formState.errors.email?.message}
							{...form.register("email")}
						/>
						<PasswordInput
							label="Password"
							placeholder="Your password"
							error={form.formState.errors.password?.message}
							{...form.register("password")}
						/>
						<Group justify="space-between">
							<Anchor component={Link} to="/forgot-password" size="sm">
								Forgot password?
							</Anchor>
						</Group>
					</Stack>
					{isError && !isLoading && (
						<Alert mt="sm" color="red" icon={<IconInfoCircle />}>
							{error}
						</Alert>
					)}
					<Button type="submit" mt="xl" fullWidth loading={isLoading}>
						Sign in
					</Button>
				</form>
			</Card>
		</AuthFormContainer>
	);
}
