import {
	Button,
	Fieldset,
	Modal,
	NumberInput,
	PasswordInput,
	Select,
	Stack,
	Switch,
	TextInput,
	type ModalProps,
} from "@mantine/core";
import {
	createBotInputSchema,
	type CreateBotInputType,
} from "@sweetreply/shared/features/admin/schemas";
import { trpc } from "@lib/trpc";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { notifications } from "@mantine/notifications";

export const CreateBotModal = (modalProps: ModalProps) => {
	const createBotMutation = trpc.admin.bots.create.useMutation();
	const trpcUtils = trpc.useUtils();

	const form = useForm<CreateBotInputType>({
		resolver: zodResolver(createBotInputSchema),
		defaultValues: {
			active: true,
			platform: "reddit",
			status: "unrestricted",
		},
	});

	const handleSubmit = form.handleSubmit((data) => {
		createBotMutation.mutate(data, {
			onSuccess: (newBot) => {
				modalProps.onClose();
				notifications.show({
					title: "Bot created",
					message: `Bot ${newBot.username} updated successfully`,
				});
				trpcUtils.admin.bots.getMany.invalidate();
			},
		});
	});

	return (
		<Modal title="Create bot" {...modalProps}>
			<form onSubmit={handleSubmit}>
				<Stack>
					<Controller
						control={form.control}
						name="platform"
						render={({ field }) => (
							<Select
								label="Platform"
								data={["reddit"]}
								value={field.value}
								onChange={field.onChange}
							/>
						)}
					/>
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
						loading={createBotMutation.isLoading}
					>
						Create
					</Button>
				</Stack>
			</form>
		</Modal>
	);
};
