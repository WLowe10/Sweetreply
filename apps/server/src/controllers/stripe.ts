import { Controller, Post, Req } from "routing-controllers";
import type { Request } from "express";

@Controller("/stripe")
export class StripeController {
    @Post("/webhook")
    async handleStripeWebhook(@Req() req: Request) {}
}
