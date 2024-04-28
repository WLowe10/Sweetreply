import { Controller, Post, Req, Res } from "routing-controllers";
import { stripe } from "@lib/client/stripe";
import { env } from "@env";
import { prisma } from "@lib/db";
import { PriceBillingPlan } from "./constants";
import { BillingPlanReplyCredits } from "@sweetreply/shared/features/billing/constants";
import { logger } from "@lib/logger";
import type { Request, Response } from "express";
import type Stripe from "stripe";

async function handleInvoicePaid(event: Stripe.Event) {
	const invoice = event.data.object as Stripe.Invoice;
	const subscriptionId = invoice.subscription;
	const customerId = invoice.customer;

	if (typeof subscriptionId !== "string" || typeof customerId !== "string") {
		return;
	}

	const subscription = await stripe.subscriptions.retrieve(subscriptionId);

	if (!subscription) {
		throw new Error("Subscription not found");
	}

	const priceId = subscription.items.data[0].price.id;

	const billingPlan = PriceBillingPlan[priceId];

	if (!billingPlan) {
		throw new Error("Invalid plan");
	}

	const newCredits = BillingPlanReplyCredits[billingPlan];

	await prisma.user.update({
		where: {
			stripe_subscription_id: subscription.id,
			stripe_customer_id: customerId,
		},
		data: {
			reply_credits: newCredits,
		},
	});
}

async function handleSubscriptionCreated(event: Stripe.Event) {
	const subscription = event.data.object as Stripe.Subscription;
	const customerId = subscription.customer as string;
	const price = subscription.items.data[0].plan.id as string;
	const plan = PriceBillingPlan[price];

	if (!plan) {
		throw new Error("Plan not found");
	}

	await prisma.user.update({
		where: {
			stripe_customer_id: customerId,
		},
		data: {
			plan,
			stripe_subscription_id: subscription.id,
			subscription_ends_at: new Date(subscription.current_period_end * 1000),
		},
	});
}

async function handleSubscriptionUpdate(event: Stripe.Event) {
	const subscription = event.data.object as Stripe.Subscription;
	const customerId = subscription.customer as string;
	const price = subscription.items.data[0].plan.id as string;
	const plan = PriceBillingPlan[price];

	if (!plan) {
		throw new Error("Plan not found");
	}

	await prisma.user.update({
		where: {
			stripe_subscription_id: subscription.id,
			stripe_customer_id: customerId,
		},
		data: {
			plan: plan,
			stripe_subscription_status: subscription.status,
			subscription_ends_at: new Date(subscription.current_period_end * 1000),
		},
	});
}

async function handleSubscriptionDeleted(event: Stripe.Event) {
	const subscription = event.data.object as Stripe.Subscription;
	const subscriptionId = subscription.id;

	await prisma.user.update({
		where: {
			stripe_subscription_id: subscriptionId,
		},
		data: {
			reply_credits: 0,
			plan: null,
			stripe_subscription_id: null,
			stripe_subscription_status: null,
			subscription_ends_at: null,
		},
	});
}

@Controller("/billing")
export class BillingController {
	@Post("/webhook")
	async handleStripeWebhook(@Req() req: Request, @Res() res: Response) {
		const sig = req.headers["stripe-signature"];

		if (!sig) {
			return res.sendStatus(400);
		}

		let event;

		try {
			// @ts-ignore
			event = stripe.webhooks.constructEvent(req.rawBody, sig, env.STRIPE_WEBHOOK_SECRET);
		} catch (err) {
			return res.sendStatus(400);
		}

		try {
			switch (event.type) {
				case "customer.subscription.created":
					await handleSubscriptionCreated(event);
					break;

				case "customer.subscription.updated":
					await handleSubscriptionUpdate(event);
					break;

				case "customer.subscription.deleted":
					await handleSubscriptionDeleted(event);
					break;

				case "invoice.paid":
					await handleInvoicePaid(event);
					break;
			}
		} catch (err) {
			logger.error(err, "Error handling stripe webhook");

			return res.sendStatus(400);
		}

		return res.json({ received: true });
	}
}
