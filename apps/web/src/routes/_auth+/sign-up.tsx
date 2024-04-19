import { type MetaFunction, Link } from "@remix-run/react";
import {
	Card,
	TextInput,
	PasswordInput,
	Anchor,
	Button,
	Text,
	Stack,
	Alert,
	Flex,
} from "@mantine/core";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { IconInfoCircle } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { useSignUp } from "@/features/auth/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthFormContainer } from "@/features/auth/components/auth-form-container";
import { signUpInputSchema } from "@sweetreply/shared/features/auth/schemas";
import { buildPageTitle } from "@/lib/utils";

export const meta: MetaFunction = () => [{ title: buildPageTitle("Sign-up") }];

const signUpFormSchema = signUpInputSchema
	.extend({
		confirm_password: signUpInputSchema.shape.password,
	})
	.refine((data) => data.password === data.confirm_password, {
		path: ["confirm_password"],
		message: "Passwords do not match",
	});

// this route should not be accessed if the user is already signed in
export default function SignUpPage() {
	const { signUp, isLoading, isError, error } = useSignUp();
	const [visible, { toggle }] = useDisclosure(false);

	const form = useForm<z.infer<typeof signUpFormSchema>>({
		resolver: zodResolver(signUpFormSchema),
	});

	return (
		<AuthFormContainer
			title="Sign-up for an account"
			subtitle={
				<Text>
					Already have an account?{" "}
					<Anchor component={Link} to="/sign-in">
						Sign in
					</Anchor>
				</Text>
			}
		>
			<Card shadow="md" radius="md" p={30} withBorder>
				<form onSubmit={form.handleSubmit(signUp)}>
					<Stack>
						<TextInput
							label="Email"
							placeholder="Your email"
							error={form.formState.errors.email?.message}
							{...form.register("email")}
						/>
						<TextInput
							label="First name"
							placeholder="John"
							error={form.formState.errors.first_name?.message}
							{...form.register("first_name")}
						/>
						<TextInput
							label="Last name"
							placeholder="Adams"
							error={form.formState.errors.last_name?.message}
							{...form.register("last_name")}
						/>
						<PasswordInput
							label="Password"
							placeholder="Your password"
							visible={visible}
							onVisibilityChange={toggle}
							error={form.formState.errors.password?.message}
							{...form.register("password")}
						/>
						<PasswordInput
							label="Confirm password"
							placeholder="Confirm password"
							visible={visible}
							onVisibilityChange={toggle}
							error={form.formState.errors.confirm_password?.message}
							{...form.register("confirm_password")}
						/>
					</Stack>
					{isError && !isLoading && (
						<Alert mt="sm" color="red" icon={<IconInfoCircle />}>
							{error}
						</Alert>
					)}
					<Button type="submit" mt="xl" mb="sm" loading={isLoading} fullWidth>
						Sign up
					</Button>
					<Text size="xs" ta="center">
						By signing up, you agree to our{" "}
						<Anchor component={Link} to="/help/terms-conditions">
							Terms and Conditions
						</Anchor>{" "}
						and{" "}
						<Anchor component={Link} to="/help/privacy-policy">
							Privacy Policy
						</Anchor>
						.
					</Text>
				</form>
			</Card>
		</AuthFormContainer>
	);
}
