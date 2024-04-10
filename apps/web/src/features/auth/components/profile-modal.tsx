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
	type ModalProps,
	Accordion,
	Flex,
	SimpleGrid,
} from "@mantine/core";
import { updateMeInputSchema } from "@sweetreply/shared/features/auth/schemas";
import { useForm } from "react-hook-form";
import { useMe, useSignOut } from "../hooks";
import { useRequestVerification } from "../hooks/use-request-verification";
import z from "zod";

export type ProfileModalProps = {
	modalProps: ModalProps;
};

export const ProfileModal = ({ modalProps }: ProfileModalProps) => {
	const { me, updateMe, mutation: updateMeMutation } = useMe();
	const { signOut } = useSignOut();
	const { requestVerification } = useRequestVerification();

	const form = useForm<z.infer<typeof updateMeInputSchema>>({
		resolver: zodResolver(updateMeInputSchema),
		values: {
			first_name: me?.first_name,
			last_name: me?.last_name,
		},
	});

	return (
		<Modal title="Profile" centered={true} {...modalProps}>
			<form onSubmit={form.handleSubmit(updateMe)}>
				<Stack>
					<Group align="start">
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
					</Group>
					<Accordion>
						<Accordion.Item value="email">
							<Accordion.Control>{me?.email}</Accordion.Control>
							<Accordion.Panel>
								<Stack>
									<Button>Resend verification email</Button>
								</Stack>
							</Accordion.Panel>
						</Accordion.Item>
					</Accordion>
					<Stack gap="xs">
						<Button
							type="submit"
							disabled={!form.formState.isDirty}
							loading={updateMeMutation.isLoading}
						>
							Save changes
						</Button>
						<SimpleGrid cols={2} spacing="xs">
							<Button type="submit" color="gray" variant="light" loading={true}>
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
						</SimpleGrid>
					</Stack>
				</Stack>
			</form>
		</Modal>
	);
};
