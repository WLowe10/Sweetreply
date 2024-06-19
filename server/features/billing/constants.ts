import { env } from "~/env";

export const BillingPlan = {
	HOBBY: "hobby",
	STANDARD: "standard",
	ENTERPRISE: "enterprise",
} as const;

export const BillingPlanReplyCredits = {
	[BillingPlan.HOBBY]: 40,
	[BillingPlan.STANDARD]: 200,
	[BillingPlan.ENTERPRISE]: 1000,
};

export const BillingPlanPrice = {
	[BillingPlan.HOBBY]: env.STRIPE_PRICE_ID_HOBBY,
	[BillingPlan.STANDARD]: env.STRIPE_PRICE_ID_STANDARD,
	[BillingPlan.ENTERPRISE]: env.STRIPE_PRICE_ID_ENTERPRISE,
} as const;

export const PriceBillingPlan = {
	[env.STRIPE_PRICE_ID_HOBBY]: BillingPlan.HOBBY,
	[env.STRIPE_PRICE_ID_STANDARD]: BillingPlan.STANDARD,
	[env.STRIPE_PRICE_ID_ENTERPRISE]: BillingPlan.ENTERPRISE,
} as const;

export type BillingPlanType = (typeof BillingPlan)[keyof typeof BillingPlan];
