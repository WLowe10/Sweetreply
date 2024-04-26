import {
	Button,
	Center,
	Flex,
	List,
	Modal,
	Stack,
	Text,
	ThemeIcon,
	type ModalProps,
} from "@mantine/core";
import { useCheckoutParams } from "../hooks/use-checkout-params";
import { IconCheck, IconCircleCheck } from "@tabler/icons-react";
import { getMonthlyReplies } from "@sweetreply/shared/features/billing/utils";

export const ThankYouModal = () => {
	const { plan, isActive, clear } = useCheckoutParams();
	const repliesPerMonth = (plan && getMonthlyReplies(plan as any)) || 0;

	const onClose = () => {
		clear();
	};

	return (
		<Modal centered opened={isActive} withCloseButton={false} onClose={onClose}>
			<Flex direction="column" align="center" py="lg">
				<ThemeIcon color="blue.5" variant="subtle" mb="md">
					<IconCircleCheck />
				</ThemeIcon>
				<Text>Thank you for subscribing to Sweetreply!</Text>
				<Text>You now have access to:</Text>
				<List mt="md" icon={<IconCheck color="var(--mantine-color-blue-5)" />}>
					<List.Item>{`${repliesPerMonth} replies per month`}</List.Item>
					<List.Item>Automatic replies</List.Item>
					<List.Item>AI generated replies</List.Item>
					<List.Item>Scheduled replies</List.Item>
				</List>
				<Button mt="md" onClick={onClose}>
					Close
				</Button>
			</Flex>
		</Modal>
	);
};
