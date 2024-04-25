import { router } from "@/trpc";
import { subscribeHandler } from "./subscribe";
import { createBillingPortalHandler } from "./create-billing-portal";

export const billingRouter = router({
	subscribe: subscribeHandler,
	createBillingPortal: createBillingPortalHandler,
});
