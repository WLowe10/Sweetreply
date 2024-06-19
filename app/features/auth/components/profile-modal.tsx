import {
	Stack,
	TextInput,
	Button,
	Modal,
	Divider,
	SimpleGrid,
	type ModalProps,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateMeInputSchema } from "~/features/auth/schemas";
import { trpc } from "@/lib/trpc";
import { useMe } from "../hooks/use-me";
import { useSignOut } from "../hooks/use-sign-out";

export type ProfileModalProps = {
	modalProps: ModalProps;
};

export const ProfileModal = ({ modalProps }: ProfileModalProps) => {
	const { me, updateMe, mutation: updateMeMutation } = useMe();
	const { signOut, isLoading: signOutLoading } = useSignOut();

	const requestPasswordResetMutation = trpc.auth.requestPasswordReset.useMutation();

	const form = useForm<z.infer<typeof updateMeInputSchema>>({
		resolver: zodResolver(updateMeInputSchema),
		values: {
			first_name: me?.first_name,
			last_name: me?.last_name,
		},
	});

	const requestPasswordReset = () => {
		requestPasswordResetMutation.mutate(undefined, {
			onSuccess: () => {
				notifications.show({
					title: "Password reset sent",
					message: "Make sure to check your spam",
				});
			},
			onError: err => {
				notifications.show({
					color: "red",
					title: "Failed to request password reset",
					message: err.message,
				});
			},
		});
	};

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
					<TextInput label="Email" readOnly={true} value={me?.email} />
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
							loading={signOutLoading}
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
