import { BillingPlan } from "@sweetreply/shared/features/billing/constants";
import type { PricingItem } from "./components/pricing-card";

export const plans: PricingItem[] = [
	{
		id: BillingPlan.MICRO,
		title: "Micro",
		description: "For experiments and small projects",
		interval: "mo",
		price: 10,
		featuresTitle: "Everything in Free, plus:",
		features: ["20 replies/mo"],
	},
	{
		id: BillingPlan.HOBBY,
		title: "Hobby",
		description: "For small businesses",
		interval: "mo",
		price: 19,
		featuresTitle: "Everything in Micro, plus:",
		features: ["40 replies/mo"],
	},
	{
		id: BillingPlan.STANDARD,
		title: "Standard",
		description: "Best for midsized businesses",
		interval: "mo",
		price: 49,
		featuresTitle: "Everything in Hobby, plus:",
		features: ["200 replies/mo"],
		highlighed: true,
	},
	{
		id: BillingPlan.ENTERPRISE,
		title: "Enterprise",
		description: "Best for large businesses",
		interval: "mo",
		price: 199,
		featuresTitle: "Everything in Standard, plus:",
		features: ["1000 replies/mo"],
	},
] as const;
