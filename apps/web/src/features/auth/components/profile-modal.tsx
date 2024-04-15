import { zodResolver } from "@hookform/resolvers/zod";
import {
	Box,
	Title,
	Card,
	Stack,
	Group,
	TextInput,
	Button,
	Modal,
	Divider,
	Alert,
	Accordion,
	Flex,
	SimpleGrid,
	type ModalProps,
	Tooltip,
	Text,
} from "@mantine/core";
import { updateMeInputSchema } from "@sweetreply/shared/features/auth/schemas";
import { useForm } from "react-hook-form";
import { useMe, useSignOut } from "../hooks";
import { useRequestVerification } from "../hooks/use-request-verification";
import z from "zod";
import { IconAlertTriangle, IconCheck } from "@tabler/icons-react";

export type ProfileModalProps = {
	modalProps: ModalProps;
};

export const ProfileModal = ({ modalProps }: ProfileModalProps) => {
	const { me, updateMe, mutation: updateMeMutation } = useMe();
	const { signOut } = useSignOut();
	const { requestVerification, isLoading: isRequestVerificationLoading } =
		useRequestVerification();

	const form = useForm<z.infer<typeof updateMeInputSchema>>({
		resolver: zodResolver(updateMeInputSchema),
		values: {
			first_name: me?.first_name,
			last_name: me?.last_name,
		},
	});

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
									loading={isRequestVerificationLoading}
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
						<Button type="submit" color="gray" variant="light">
							Change password
						</Button>
						<Button
							type="submit"
							color="gray"
							variant="light"
							onClick={() => signOut()}
						>
							Sign out
						</Button>
					</Stack>
				</Stack>
			</form>
		</Modal>
	);
};
