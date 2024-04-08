import { Controller, Post } from "routing-controllers";

@Controller("/stripe")
export class StripeController {
	@Post("/webhook")
	async handleStripeWebhook() {
		console.log("stripe webhook received");

		return "test";
	}
}
