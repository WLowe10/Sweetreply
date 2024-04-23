import { authenticatedProcedure } from "@/trpc";
import { buildFrontendUrl } from "@/lib/utils";
import { TRPCError } from "@trpc/server";
import { billingPlanSchema } from "../schemas";
import { BillingPlanPrice } from "../constants";
import { z } from "zod";

const subscribeInputSchema = z.object({
	plan: billingPlanSchema,
});

export const subscribeHandler = authenticatedProcedure
	.input(subscribeInputSchema)
	.mutation(async ({ input, ctx }) => {
		if (ctx.user.plan) {
			throw new TRPCError({
				code: "FORBIDDEN",
				message:
					"You are already subscribed to a plan. Please visit your billing portal to make any changes.",
			});
		}

		if (ctx.user.stripe_customer_id === null) {
			throw new TRPCError({
				code: "FORBIDDEN",
				message: "You are unable to subscribe currently. Please contact support.",
			});
		}

		const plan = input.plan;
		const priceID = BillingPlanPrice[input.plan];

		const checkout = await ctx.stripe.checkout.sessions.create({
			mode: "subscription",
			payment_method_types: ["card"],
			customer: ctx.user.stripe_customer_id,
			consent_collection: {
				terms_of_service: "required",
			},
			success_url: buildFrontendUrl({
				path: "/dashboard",
				query: {
					plan: plan,
					status: "success",
				},
			}),
			cancel_url: buildFrontendUrl({
				path: "/dashboard",
				query: {
					plan: plan,
					status: "cancel",
				},
			}),
			line_items: [
				{
					price: priceID,
					quantity: 1,
				},
			],
		});

		if (!checkout.url) {
			throw new TRPCError({
				code: "INTERNAL_SERVER_ERROR",
				message: "Failed to create checkout session. Please try again later.",
			});
		}

		return {
			checkoutUrl: checkout.url,
		};
	});
