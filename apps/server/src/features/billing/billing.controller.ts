import { Controller, Post, Req, Res } from "routing-controllers";
import { stripe } from "@lib/client/stripe";
import { prisma } from "@lib/db";
import { logger } from "@lib/logger";
import { sendDiscordNotification } from "@lib/discord-notification";
import { env } from "@env";
import { PriceBillingPlan } from "./constants";
import { BillingPlanReplyCredits } from "@sweetreply/shared/features/billing/constants";
import * as leadEngineService from "@features/lead-engine/service";
import type { Request, Response } from "express";
import type Stripe from "stripe";

async function handleInvoicePaid(event: Stripe.Event) {
	const invoice = event.data.object as Stripe.Invoice;
	const subscriptionId = invoice.subscription;
	const customerId = invoice.customer;

	// don't remove reply credits if a user downgrades
	if (invoice.amount_paid <= 0) {
		return;
	}

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

	const updatedUser = await prisma.user.update({
		where: {
			stripe_subscription_id: subscription.id,
			stripe_customer_id: customerId,
		},
		data: {
			reply_credits: newCredits,
		},
	});

	await sendDiscordNotification({
		title: "Cha-Ching!",
		description: "💸 Invoice paid, money made! 💸",
		color: 5814783,
		fields: [
			{
				name: "User ID",
				value: updatedUser.id,
			},
			{
				name: "User email",
				value: updatedUser.email,
			},
			{
				name: "Amount",
				value: `$${invoice.total / 100}`,
			},
		],
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

	const updatedUser = await prisma.user.update({
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

	try {
		// cancel all of a user's scheduled replies when their subscription ends

		await leadEngineService.cancelUserScheduledReplies(updatedUser.id);
	} catch {
		// noop
	}
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
