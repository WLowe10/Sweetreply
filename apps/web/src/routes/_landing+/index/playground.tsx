import { trpc } from "@/lib/trpc";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	Box,
	type BoxProps,
	Card,
	SimpleGrid,
	Stack,
	TextInput,
	Button,
	Textarea,
	Divider,
	Group,
	Avatar,
	Flex,
	Title,
	Text,
	Skeleton,
	Alert,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useForm } from "react-hook-form";
import {
	generatePlaygroundReplyInputSchema,
	type GeneratePlaygroundReplyInputType,
} from "@sweetreply/shared/features/playground/schemas";
import { IconCheck, IconInfoCircle } from "@tabler/icons-react";

export const Playground = (boxProps: BoxProps) => {
	const generateReplyMutation = trpc.playground.generateReply.useMutation();

	const form = useForm<GeneratePlaygroundReplyInputType>({
		resolver: zodResolver(generatePlaygroundReplyInputSchema),
		defaultValues: {
			product_name: "Gringotts Wizarding Bank",
			product_description:
				"Gringotts Wizarding Bank offers secure vaults for storing wizarding wealth, safeguarded by magical enchantments. With a legacy spanning centuries, we provide unparalleled financial services to the magical community. Trust Gringotts for all your banking needs in the wizarding world.",
			social_media_post:
				"I'm looking for an extremely secure bank with 24/7 security. Does anyone have any recommendations?",
		},
	});

	const onSubmit = form.handleSubmit(async (values) => {
		generateReplyMutation.mutate(values, {
			onError: (err) => {
				notifications.show({
					title: "Failed to generate playground reply",
					message: err.message,
				});
			},
		});
	});

	return (
		<Box component="section" id="playground" {...boxProps}>
			<Title ta="center" mb="xl" fw={900}>
				Try it out
			</Title>
			<form onSubmit={onSubmit}>
				<SimpleGrid cols={{ base: 1, lg: 2 }} spacing="md">
					<Card withBorder p="lg">
						<Stack h="100%">
							<TextInput
								label="Product name"
								placeholder="Product name"
								{...form.register("product_name")}
							/>
							<Textarea
								label="Product description"
								placeholder="Product description"
								autosize={true}
								minRows={10}
								{...form.register("product_description")}
							/>
						</Stack>
					</Card>
					<Card withBorder p="lg">
						<Flex direction="column" justify="space-between" h="100%">
							<Stack h="100%">
								<Textarea
									label="Social media post"
									placeholder="Social media post"
									resize="vertical"
									autosize={true}
									minRows={3}
									{...form.register("social_media_post")}
								/>
								<Card shadow="md" withBorder flex={1}>
									<Group mb="md">
										<Avatar>🍬</Avatar>
										Sweetreply
									</Group>
									{generateReplyMutation.isLoading ? (
										<Skeleton height={50} />
									) : (
										<Box>
											{generateReplyMutation.data && (
												<>
													<Text size="sm" mb="md">
														{generateReplyMutation.data.reply}
													</Text>
													<Alert
														variant="transparent"
														icon={
															generateReplyMutation.data
																.shouldReply ? (
																<IconCheck />
															) : (
																<IconInfoCircle />
															)
														}
													>
														{generateReplyMutation.data.shouldReply ===
														true
															? "Sweetreply would automatically reply to this post"
															: "Sweetreply would not automatically reply to this post as it is not a great match"}
													</Alert>
												</>
											)}
										</Box>
									)}
								</Card>
							</Stack>
							<Button type="submit" mt="md" loading={generateReplyMutation.isLoading}>
								Generate reply
							</Button>
						</Flex>
					</Card>
				</SimpleGrid>
			</form>
		</Box>
	);
};
