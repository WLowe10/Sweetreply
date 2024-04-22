import { zodResolver } from "@hookform/resolvers/zod";
import {
	Stack,
	TextInput,
	Button,
	Modal,
	Divider,
	Alert,
	SimpleGrid,
	Tooltip,
	Text,
	type ModalProps,
} from "@mantine/core";
import { updateMeInputSchema } from "@sweetreply/shared/features/auth/schemas";
import { useForm } from "react-hook-form";
import { useMe } from "../hooks/use-me";
import { useSignOut } from "../hooks/use-sign-out";
import { IconAlertTriangle, IconCheck } from "@tabler/icons-react";
import { trpc } from "@/lib/trpc";
import { notifications } from "@mantine/notifications";
import z from "zod";

export type ProfileModalProps = {
	modalProps: ModalProps;
};

export const ProfileModal = ({ modalProps }: ProfileModalProps) => {
	const { me, updateMe, mutation: updateMeMutation } = useMe();
	const { signOut } = useSignOut();

	const requestVerificationMutation = trpc.auth.requestVerification.useMutation();
	const requestPasswordResetMutation = trpc.auth.requestPasswordReset.useMutation();

	const form = useForm<z.infer<typeof updateMeInputSchema>>({
		resolver: zodResolver(updateMeInputSchema),
		values: {
			first_name: me?.first_name,
			last_name: me?.last_name,
		},
	});

	const requestVerification = () => {
		requestVerificationMutation.mutate(undefined, {
			onSuccess: () => {
				notifications.show({
					title: "Verification email sent",
					message: "Make sure to check your spam",
				});
			},
			onError: (err) => {
				notifications.show({
					color: "red",
					title: "Failed to request send verification",
					message: err.message,
				});
			},
		});
	};

	const requestPasswordReset = () => {
		requestPasswordResetMutation.mutate(undefined, {
			onSuccess: () => {
				notifications.show({
					title: "Password reset sent",
					message: "Make sure to check your spam",
				});
			},
			onError: (err) => {
				notifications.show({
					color: "red",
					title: "Failed to request password reset",
					message: err.message,
				});
			},
		});
	};

	const isVerified = me?.verified_at !== null;

	return (
		<Modal title="Profile" centered={true} {...modalProps}>
			<form onSubmit={form.handleSubmit(updateMe)}>
				<Stack>
					<SimpleGrid cols={2}>
						<TextInput
							label="First name"
							error={form.formState.errors.first_name?.message}
							{...form.register("first_name")}
						/>
						<TextInput
							label="Last name"
							error={form.formState.errors.last_name?.message}
							{...form.register("last_name")}
						/>
					</SimpleGrid>
					<TextInput
						label="Email"
						readOnly={true}
						rightSection={
							isVerified && (
								<Tooltip label="Verified">
									<IconCheck color="var(--mantine-color-green-4)" size={16} />
								</Tooltip>
							)
						}
						value={me?.email}
					/>
					{!isVerified && (
						<Alert
							variant="outline"
							title="Action required"
							icon={<IconAlertTriangle />}
						>
							<Stack>
								<Text>
									Your account is not verified. Please click the button below.
								</Text>
								<Button
									size="xs"
									loading={requestVerificationMutation.isLoading}
									onClick={requestVerification}
								>
									Request verification
								</Button>
							</Stack>
						</Alert>
					)}
					<Divider />
					<Stack gap="xs">
						<Button
							type="submit"
							disabled={!form.formState.isDirty}
							loading={updateMeMutation.isLoading}
						>
							Save changes
						</Button>
						<Button
							color="gray"
							variant="light"
							loading={requestPasswordResetMutation.isLoading}
							onClick={requestPasswordReset}
						>
							Reset password
						</Button>
						<Button
							type="submit"
							color="gray"
							variant="light"
							onClick={() =>
								signOut({
									all: false,
								})
							}
						>
							Sign out
						</Button>
					</Stack>
				</Stack>
			</form>
		</Modal>
	);
};
