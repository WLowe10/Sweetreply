import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { authenticatedProcedure } from "@features/auth/procedures";
import { buildFrontendUrl } from "@utils";
import { env } from "@env";

const subscribeInputSchema = z.object({
	amount: z.number().min(10).max(1000),
});

export const createTokenCheckoutHandler = authenticatedProcedure
	.input(subscribeInputSchema)
	.mutation(async ({ input, ctx }) => {
		if (env.CHECKOUT_DISABLED) {
			throw new TRPCError({
				code: "FORBIDDEN",
				message: "New checkouts are currently disabled",
			});
		}

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

		const checkout = await ctx.stripe.checkout.sessions.create({
			payment_method_types: ["card"],
			customer: ctx.user.stripe_customer_id,
			consent_collection: {
				terms_of_service: "required",
			},
			success_url: buildFrontendUrl({
				path: "/billing",
				query: {
					tokens: input.amount.toString(),
					status: "success",
				},
			}),
			cancel_url: buildFrontendUrl({
				path: "/billing",
			}),
			line_items: [
				{
					price_data: {
						currency: "usd",
						product_data: {
							name: "Token",
						},
						unit_amount: 50, // 50 cents per token
					},
					quantity: input.amount,
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
			checkoutURL: checkout.url,
		};
	});
