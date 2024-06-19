import { useState } from "react";
import { notifications } from "@mantine/notifications";
import { getMonthlyReplies } from "~/features/billing/utils";
import { RelativeDate } from "@/components/relative-date";
import { ResourceContainer } from "@/components/resource-container";
import { useMe } from "@/features/auth/hooks/use-me";
import { PricingCard } from "@/features/billing/components/pricing-card";
import { ThankYouModal } from "@/features/billing/components/thank-you-modal";
import { plans } from "@/features/billing/constants";
import { Button, SimpleGrid, Skeleton, Table } from "@mantine/core";
import { buildPageTitle } from "@/utils";
import { trpc } from "@/lib/trpc";
import type { MetaFunction } from "@remix-run/react";

export const meta: MetaFunction = () => [{ title: buildPageTitle("Billing") }];

export default function BillingPage() {
	const { me, isSubscribed } = useMe();
	const subscribeMutation = trpc.billing.subscribe.useMutation();
	const createBillingPortalMutation = trpc.billing.createBillingPortal.useMutation();

	const [planCheckoutLoading, setPlanCheckoutLoading] = useState<string | null>(null);

	const subscribe = (plan: string) => {
		subscribeMutation.mutate(
			{
				plan: plan as any,
			},
			{
				onSuccess: data => {
					window.location.href = data.checkoutURL;
				},
				onError: err => {
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
			onSuccess: data => {
				window.location.href = data.billingPortalURL;
			},
		});
	};

	return me ? (
		<ResourceContainer
			title="Billing"
			subtitle={
				me.plan
					? `You are subscribed to the ${me.plan} plan`
					: "Subscribe to a plan today to unlock replies!"
			}
			rightSection={
				me.plan && (
					<Button
						disabled={!me?.plan}
						loading={createBillingPortalMutation.isLoading}
						onClick={createBillingPortal}
					>
						Manage subscription
					</Button>
				)
			}
		>
			{isSubscribed ? (
				<Table>
					<Table.Tbody>
						<Table.Tr>
							<Table.Td>Plan</Table.Td>
							<Table.Td>{me.plan}</Table.Td>
						</Table.Tr>
						<Table.Tr>
							<Table.Td>Monthly replies</Table.Td>
							<Table.Td>{getMonthlyReplies(me.plan as any)}</Table.Td>
						</Table.Tr>
						<Table.Tr>
							<Table.Td>Ends at</Table.Td>
							<Table.Td>
								<RelativeDate size="sm" date={me.subscription_ends_at!} />
							</Table.Td>
						</Table.Tr>
					</Table.Tbody>
				</Table>
			) : (
				<SimpleGrid cols={{ base: 1, md: 3 }}>
					{plans.map(plan => (
						<PricingCard
							key={plan.title}
							{...plan}
							highlighed={false}
							cta={
								<Button
									mt="md"
									loading={planCheckoutLoading === plan.id}
									disabled={subscribeMutation.isLoading}
									onClick={() => {
										subscribe(plan.id);
										setPlanCheckoutLoading(plan.id);
									}}
								>
									Subscribe
								</Button>
							}
						/>
					))}
				</SimpleGrid>
			)}
			<ThankYouModal />
		</ResourceContainer>
	) : (
		<Skeleton height="100%" />
	);
}
