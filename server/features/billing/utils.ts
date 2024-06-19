import { BillingPlanReplyCredits, BillingPlanType } from "./constants";

export const getMonthlyReplies = (billingPlan: BillingPlanType) =>
	BillingPlanReplyCredits[billingPlan];
