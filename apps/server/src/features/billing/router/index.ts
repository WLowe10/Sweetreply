import { router } from "@lib/trpc";
import { subscribeHandler } from "./subscribe";
import { createBillingPortalHandler } from "./create-billing-portal";
import { createTokenCheckoutHandler } from "./create-token-checkout";

export const billingRouter = router({
	subscribe: subscribeHandler,
	createBillingPortal: createBillingPortalHandler,
	// createTokenCheckout: createTokenCheckoutHandler,
});
