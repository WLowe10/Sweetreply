import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Title, Card, Stack, Group, TextInput, Button, Modal, Divider, Alert } from "@mantine/core";
import { updateMeInputSchema } from "@replyon/shared/schemas/auth";
import { useForm } from "react-hook-form";
import { useMe, useSignOut } from "../hooks";
import { useRequestVerification } from "../hooks/use-request-verification";
import z from "zod";

export const ProfileModal = () => {
	const { me, updateMe } = useMe();
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
		<Modal title="Profile" centered={true} onClose={() => {}}>
			<form onSubmit={form.handleSubmit(updateMe)}>
				<Stack>
					<Alert>Lol</Alert>
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
					<Button type="submit" disabled={!form.formState.isDirty}>
						Save changes
					</Button>
					<Divider />
					<Button type="submit" onClick={() => signOut()}>
						Sign out
					</Button>
				</Stack>
			</form>
		</Modal>
	);
};
