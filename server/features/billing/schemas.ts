import { z } from "zod";
import { BillingPlan } from "./constants";

export const subscriptionMetadataSchema = z.object({
	user_id: z.string(),
});

export const billingPlanSchema = z.enum([
	BillingPlan.HOBBY,
	BillingPlan.STANDARD,
	BillingPlan.ENTERPRISE,
]);

export type SubscriptionMetadataType = z.infer<typeof subscriptionMetadataSchema>;
