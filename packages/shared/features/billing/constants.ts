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
