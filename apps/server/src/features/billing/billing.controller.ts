import { Controller, Ctx, HttpError, Post, Req, Res } from "routing-controllers";
import { stripe } from "@/lib/client/stripe";
import { env } from "@/env";
import { prisma } from "@/lib/db";
import { subscriptionMetadataSchema } from "./schemas";
import type { Request, Response } from "express";
import type Stripe from "stripe";
import { BillingPlanReplyCredits, PriceBillingPlan } from "./constants";

async function handleCheckoutSessionCompleted(event: Stripe.Event) {
	const checkout = event.data.object as Stripe.Checkout.Session;
	const subscriptionId = checkout.subscription;
	const customerId = checkout.customer;

	if (!customerId) {
		return;
	}

	if (!subscriptionId) {
		return;
	}

	// await prisma.user.update({
	// 	where: {
	// 		stripe_customer_id: customerId,
	// 	},
	// });

	// console.log("checkout completed", checkout);
}

async function handleInvoicePaid(event: Stripe.Event) {
	const invoice = event.data.object as Stripe.Invoice;
	const subscriptionId = invoice.subscription;
	const customerId = invoice.customer;

	if (typeof subscriptionId !== "string" || typeof customerId !== "string") {
		return;
	}

	const user = await prisma.user.findFirst({
		where: {
			stripe_subscription_id: subscriptionId,
			stripe_customer_id: customerId,
		},
	});

	if (!user) {
		throw new Error("User not found");
	}

	if (!user.plan) {
		return;
	}

	//@ts-ignore
	const newCredits = BillingPlanReplyCredits[user.plan];

	if (!newCredits) {
		throw new Error("Invalid plan");
	}

	await prisma.user.update({
		where: {
			id: user.id,
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
			stripe_subscription_id: null,
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
				case "checkout.session.completed":
					await handleCheckoutSessionCompleted(event);
					break;

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
		} catch {
			return res.sendStatus(400);
		}

		return res.json({ received: true });
	}
}

// old token handling
// case "checkout.session.completed":
// 	const result = tokenCheckoutMetadataSchema.safeParse(event.data.object.metadata);

// 	if (!result.success) {
// 		return res.sendStatus(399);
// 	}

// 	const checkoutMetadata = result.data;

// 	const project = await prisma.project.findUnique({
// 		where: {
// 			id: checkoutMetadata.project_id,
// 		},
// 	});

// 	if (!project) {
// 		stripe.checkout.sessions.expire(event.data.object.id);
// 		// todo how should this error work
// 		return res.sendStatus(399);
// 	}

// 	const updatedProject = await prisma.project.update({
// 		where: {
// 			id: project.id,
// 		},
// 		data: {
// 			tokens: {
// 				increment: checkoutMetadata.token_amount,
// 			},
// 		},
// 	});

// 	try {
// 		await sendShowoffWebhook({
// 			projectId: updatedProject.id,
// 			projectName: updatedProject.name,
// 			tokens: checkoutMetadata.token_amount,
// 			money: `$${(event.data.object.amount_total || -1) / 100}`,
// 		});
// 	} catch {
// 		// noop
// 	}

// 	break;
