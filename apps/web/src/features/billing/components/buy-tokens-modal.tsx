import { trpc } from "@/lib/trpc";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	Anchor,
	Button,
	Card,
	Divider,
	Flex,
	Group,
	Modal,
	NumberInput,
	Pill,
	Stack,
	Text,
	type ModalProps,
} from "@mantine/core";
import { buyTokensInputSchema } from "@sweetreply/shared/features/projects/schemas";
import { IconCircleCheck } from "@tabler/icons-react";
import { Controller, useForm } from "react-hook-form";
import { getTokensPrice, getTokensTier } from "@sweetreply/shared/features/projects/utils";
import { Link } from "@remix-run/react";

export type BuyTokensModalProps = {
	modalProps: ModalProps;
};

export const BuyTokensModal = ({ modalProps }: BuyTokensModalProps) => {
	return (
		<Modal
			title={
				<Text>
					Sweetreply is{" "}
					<Text component="span" fw="bolder" c="white">
						{" "}
						a lot more fun{" "}
					</Text>
					with replies
				</Text>
			}
			{...modalProps}
		>
			<Stack>
				<Stack>
					<Card>
						<Group>
							<IconCircleCheck color="var(--mantine-color-green-5)" />
							<Stack>
								<Text>AI powered replies</Text>
								<Text c="dimmed" size="sm">
									Sweetreply will automatically engage with your leads. Imagine
									finding new customers while you're sleeping.
								</Text>
							</Stack>
						</Group>
					</Card>
					<Card>
						<Group>
							<IconCircleCheck color="var(--mantine-color-green-5)" />
							<Stack>
								<Text>AI powered sentiment analysis</Text>
								<Text c="dimmed" size="sm">
									Sweetreply will intelligently filter out the leads it shouldn't
									reply to.
								</Text>
							</Stack>
						</Group>
					</Card>
				</Stack>
				<Divider />
				<form onSubmit={handleSubmit}>
					<Stack>
						<div>
							<Controller
								name="amount"
								control={form.control}
								render={({ field, fieldState }) => (
									<NumberInput
										label="Amount"
										description="Enter the amount of tokens you'd like to purchase"
										error={fieldState.error?.message}
										value={field.value}
										allowDecimal={false}
										allowLeadingZeros={false}
										allowNegative={false}
										onChange={field.onChange}
									/>
								)}
							/>
							<Flex justify="space-between" align="center" mt="xs">
								<Anchor component={Link} to="/pricing" size="xs">
									Pricing
								</Anchor>
								<Text size="xs">{`${tier?.name} ($${tier?.ppt.toFixed(
									2
								)}/token)`}</Text>
							</Flex>
						</div>
						<Button
							type="submit"
							fullWidth
							disabled={!form.formState.isValid}
							loading={buyTokensMutation.isLoading}
						>{`Buy ${amount} tokens ($${price.toFixed(2)})`}</Button>
					</Stack>
				</form>
			</Stack>
		</Modal>
	);
};
