export const BillingPlan = {
	MICRO: "micro",
	HOBBY: "hobby",
	STANDARD: "standard",
	ENTERPRISE: "enterprise",
} as const;

export const BillingPlanReplyCredits = {
	[BillingPlan.MICRO]: 20,
	[BillingPlan.HOBBY]: 40,
	[BillingPlan.STANDARD]: 200,
	[BillingPlan.ENTERPRISE]: 1000,
};

export type BillingPlanType = (typeof BillingPlan)[keyof typeof BillingPlan];
