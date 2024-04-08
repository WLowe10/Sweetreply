import { Controller, Get, Post, Req } from "routing-controllers";
import type { Request } from "express";

@Controller("/stripe")
export class StripeController {
	@Post("/webhook")
	async handleStripeWebhook() {
		console.log("stripe webhook received");

		return "test";
	}
}
