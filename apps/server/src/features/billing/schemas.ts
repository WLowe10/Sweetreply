import { z } from "zod";
import { BillingPlan } from "./constants";

export const billingPlanSchema = z.enum([BillingPlan.HOBBY]);

export const subscriptionMetadataSchema = z.object({
	user_id: z.string(),
});

export type SubscriptionMetadataType = z.infer<typeof subscriptionMetadataSchema>;
