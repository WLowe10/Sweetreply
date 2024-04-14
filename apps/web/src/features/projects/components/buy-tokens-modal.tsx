import {
	Button,
	Card,
	Divider,
	Group,
	Modal,
	Stack,
	Text,
	Title,
	type ModalProps,
} from "@mantine/core";
import { IconCircleCheck } from "@tabler/icons-react";

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
					with tokens
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
									Sweetreply will automatically engage with your leads. Imagine
									finding new customers while you're sleeping.
								</Text>
							</Stack>
						</Group>
					</Card>
				</Stack>
				<Divider />
				<Button fullWidth>Buy tokens</Button>
			</Stack>
		</Modal>
	);
};
