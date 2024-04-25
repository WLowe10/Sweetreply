import { Modal, type ModalProps } from "@mantine/core";
import { useCheckoutParams } from "../hooks/use-checkout-params";

export const ThankYouModal = () => {
	const { plan, isActive, clear } = useCheckoutParams();

	const onClose = () => {
		clear();
	};

	return (
		<Modal centered opened={isActive} onClose={onClose}>
			Thank you for subscribing to {plan}
		</Modal>
	);
};
