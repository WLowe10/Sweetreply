import { BillingPlan } from "@sweetreply/shared/features/billing/constants";
import { env } from "@env";

export const BillingPlanPrice = {
	[BillingPlan.MICRO]: env.STRIPE_PRICE_ID_MICRO,
	[BillingPlan.HOBBY]: env.STRIPE_PRICE_ID_HOBBY,
	[BillingPlan.STANDARD]: env.STRIPE_PRICE_ID_STANDARD,
	[BillingPlan.ENTERPRISE]: env.STRIPE_PRICE_ID_ENTERPRISE,
} as const;

export const PriceBillingPlan = {
	[env.STRIPE_PRICE_ID_MICRO]: BillingPlan.MICRO,
	[env.STRIPE_PRICE_ID_HOBBY]: BillingPlan.HOBBY,
	[env.STRIPE_PRICE_ID_STANDARD]: BillingPlan.STANDARD,
	[env.STRIPE_PRICE_ID_ENTERPRISE]: BillingPlan.ENTERPRISE,
} as const;
