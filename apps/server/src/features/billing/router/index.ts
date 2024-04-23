import { router } from "@/trpc";
import { subscribeHandler } from "./subscribe";
import { getBillingPortalHandler } from "./get-billing-portal";

export const billingRouter = router({
	subscribe: subscribeHandler,
	getBillingPortal: getBillingPortalHandler,
});
