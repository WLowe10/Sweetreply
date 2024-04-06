import { useMe } from "@/features/auth/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Card, Flex, Group, Stack, TextInput, Title } from "@mantine/core";
import { updateMeInputSchema } from "@sweetreply/shared/schemas/auth";
import { useForm } from "react-hook-form";
import z from "zod";

// figure out user avatar

export default function ProfilePage() {
	const { me, updateMe } = useMe();

	const form = useForm<z.infer<typeof updateMeInputSchema>>({
		resolver: zodResolver(updateMeInputSchema),
		values: {
			first_name: me?.first_name,
			last_name: me?.last_name,
		},
	});

	return (
		<Box mih="100vh" p="lg">
			<Title order={2}>Profile</Title>
			<Card mx="auto" maw="40rem">
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
						<Button type="submit" disabled={!form.formState.isDirty}>
							Save changes
						</Button>
					</Stack>
				</form>
			</Card>
		</Box>
	);
}
