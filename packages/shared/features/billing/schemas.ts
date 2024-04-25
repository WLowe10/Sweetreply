import { BillingPlan } from "./constants";
import { z } from "zod";

export const billingPlanSchema = z.enum([
	BillingPlan.HOBBY,
	BillingPlan.STANDARD,
	BillingPlan.ENTERPRISE,
]);
