import { ResourceContainer } from "@/components/resource-container";
import { useMe } from "@/features/auth/hooks/use-me";
import { PricingCard } from "@/features/billing/components/pricing-card";
import { ThankYouModal } from "@/features/billing/components/thank-you-modal";
import { plans } from "@/features/billing/constants";
import { trpc } from "@/lib/trpc";
import { Button, SimpleGrid } from "@mantine/core";
import { notifications } from "@mantine/notifications";

export default function BillingPage() {
	const { me } = useMe();

	const subscribeMutation = trpc.billing.subscribe.useMutation();
	const createBillingPortalMutation = trpc.billing.createBillingPortal.useMutation();

	const subscribe = (plan: string) => {
		console.log(plan);

		subscribeMutation.mutate(
			{
				plan,
			},
			{
				onSuccess: (data) => {
					window.location.href = data.checkoutURL;
				},
				onError: (err) => {
					notifications.show({
						title: "Failed to subscribe",
						message: err.message,
					});
				},
			}
		);
	};

	const createBillingPortal = () => {
		createBillingPortalMutation.mutate(undefined, {
			onSuccess: (data) => {
				window.location.href = data.billingPortalURL;
			},
		});
	};

	return (
		<ResourceContainer
			title="Billing"
			rightSection={
				<Button
					disabled={!me?.plan}
					loading={createBillingPortalMutation.isLoading}
					onClick={createBillingPortal}
				>
					Manage subscription
				</Button>
			}
		>
			<ThankYouModal />
			<SimpleGrid cols={{ base: 1, md: 2 }}>
				{plans.map((plan) => (
					<PricingCard
						key={plan.title}
						{...plan}
						highlighed={false}
						cta={
							<Button mt="md" onClick={() => subscribe(plan.id)}>
								Subscribe
							</Button>
						}
					/>
				))}
			</SimpleGrid>
		</ResourceContainer>
	);
}
