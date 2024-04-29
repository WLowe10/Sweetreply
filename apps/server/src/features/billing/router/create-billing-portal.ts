import { buildFrontendUrl } from "@lib/utils";
import { TRPCError } from "@trpc/server";
import { subscribedProcedure } from "../procedures";

export const createBillingPortalHandler = subscribedProcedure.mutation(async ({ ctx }) => {
	if (!ctx.user.stripe_customer_id) {
		throw new TRPCError({
			code: "FORBIDDEN",
			message: "You need to have a subscription to access the billing portal.",
		});
	}

	const billingPortal = await ctx.stripe.billingPortal.sessions.create({
		customer: ctx.user.stripe_customer_id,
		return_url: buildFrontendUrl("/billing"),
	});

	if (!ctx.user.stripe_customer_id) {
		throw new TRPCError({
			code: "INTERNAL_SERVER_ERROR",
			message: "You need to have a subscription to access the billing portal.",
		});
	}

	if (!billingPortal.url) {
		throw new TRPCError({
			code: "INTERNAL_SERVER_ERROR",
			message: "Failed to create a billing portal session. Please try again later.",
		});
	}

	return {
		billingPortalURL: billingPortal.url,
	};
});
