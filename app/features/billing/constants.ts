import { BillingPlan } from "~/features/billing/constants";
import type { PricingItem } from "./components/pricing-card";

export const plans: PricingItem[] = [
	{
		id: BillingPlan.HOBBY,
		title: "Hobby",
		description: "For small projects and experiments",
		interval: "mo",
		price: 19,
		featuresTitle: "Everything in Free, plus:",
		features: ["40 replies/mo", "Auto replies", "AI generated replies", "Scheduled replies"],
	},
	{
		id: BillingPlan.STANDARD,
		title: "Standard",
		description: "Best for small businesses",
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
