import { Controller, BadRequestError, Post, Req, Res } from "routing-controllers";
import { stripe } from "@/lib/client/stripe";
import { env } from "@/env";
import { prisma } from "@/lib/db";
import { tokenCheckoutMetadataSchema } from "@/features/projects/schemas";
import { sendShowoffWebhook } from "@/features/projects/utils/send-showoff-webhook";
import type { Request, Response } from "express";

@Controller("/stripe")
export class StripeController {
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

		switch (event.type) {
			case "checkout.session.completed":
				const result = tokenCheckoutMetadataSchema.safeParse(event.data.object.metadata);

				if (!result.success) {
					return res.sendStatus(400);
				}

				const checkoutMetadata = result.data;

				const project = await prisma.project.findUnique({
					where: {
						id: checkoutMetadata.project_id,
					},
				});

				if (!project) {
					stripe.checkout.sessions.expire(event.data.object.id);
					// todo how should this error work
					return res.sendStatus(400);
				}

				const updatedProject = await prisma.project.update({
					where: {
						id: project.id,
					},
					data: {
						tokens: {
							increment: checkoutMetadata.token_amount,
						},
					},
				});

				try {
					await sendShowoffWebhook({
						projectId: updatedProject.id,
						projectName: updatedProject.name,
						tokens: checkoutMetadata.token_amount,
						money: `$${(event.data.object.amount_total || 0) / 100}`,
					});
				} catch {
					// noop
				}

				break;
		}

		return res.json({ received: true });
	}
}
