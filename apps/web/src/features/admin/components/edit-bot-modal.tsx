import {
	Button,
	Fieldset,
	Flex,
	Modal,
	NumberInput,
	PasswordInput,
	Stack,
	TextInput,
	type ModalProps,
} from "@mantine/core";
import {
	updateBotInputSchema,
	UpdateBotInputType,
} from "@sweetreply/shared/features/admin/schemas";
import { trpc } from "@lib/trpc";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { notifications } from "@mantine/notifications";

export type EditBotModalProps = {
	botId: string;
	modalProps: ModalProps;
};

export const EditBotModal = ({ botId, modalProps }: EditBotModalProps) => {
	const getBotQuery = trpc.admin.bots.get.useQuery({
		id: botId,
	});

	const updateBotMutation = trpc.admin.bots.update.useMutation();

	const trpcUtils = trpc.useUtils();

	const form = useForm<UpdateBotInputType["data"]>({
		resolver: zodResolver(updateBotInputSchema.shape.data),
		values: {
			username: getBotQuery.data?.username || "",
			password: getBotQuery.data?.password || "",
			platform: getBotQuery.data?.platform as any,
			proxy_host: getBotQuery.data?.proxy_host,
			proxy_port: getBotQuery.data?.proxy_port,
			proxy_user: getBotQuery.data?.proxy_user,
			proxy_pass: getBotQuery.data?.proxy_pass,
		},
	});

	const handleSubmit = form.handleSubmit(async (data) => {
		updateBotMutation.mutate(
			{
				id: botId,
				data,
			},
			{
				onSuccess: (updatedBot) => {
					modalProps.onClose();
					notifications.show({
						title: "Bot updated",
						message: `Bot ${updatedBot.username} updated successfully`,
					});
				},
			}
		);
	});

	return (
		<Modal title="Edit bot" {...modalProps}>
			<form onSubmit={handleSubmit}>
				<Stack>
					<TextInput
						label="Username"
						placeholder="monkeyman20212"
						{...form.register("username")}
					/>
					<PasswordInput
						label="Password"
						placeholder="secretpassword"
						{...form.register("password")}
					/>
					<Fieldset legend="Proxy" variant="filled">
						<Stack>
							<TextInput
								label="Host"
								placeholder="000.000.000.000"
								{...form.register("proxy_host")}
							/>
							<Controller
								name="proxy_port"
								control={form.control}
								render={({ field, fieldState }) => (
									<NumberInput
										label="Port"
										placeholder="9999"
										error={fieldState.error?.message}
										value={field.value || ""}
										onChange={field.onChange}
									/>
								)}
							/>
							<TextInput
								label="Username"
								placeholder="proxyuser"
								{...form.register("proxy_user")}
							/>
							<TextInput
								label="Password"
								placeholder="proxypass"
								{...form.register("proxy_pass")}
							/>
						</Stack>
					</Fieldset>
					<Button
						type="submit"
						disabled={!form.formState.isDirty}
						loading={updateBotMutation.isLoading}
					>
						Save
					</Button>
				</Stack>
			</form>
		</Modal>
	);
};
