import { authenticatedProcedure } from "@/trpc";
import { stripe } from "@/lib/client/stripe";
import { buyTokensInputSchema } from "@sweetreply/shared/features/projects/schemas";
import { projectConstants } from "@sweetreply/shared/features/projects/constants";
import { buildFrontendUrl } from "@/lib/utils";
import { TokenCheckoutMetadataType } from "../schemas";
import { projectNotFound } from "../errors";

export const buyTokensHandler = authenticatedProcedure
	.input(buyTokensInputSchema)
	.mutation(async ({ input, ctx }) => {
		const projectId = input.project_id;
		const tokenAmount = input.amount;

		const userOwnsProject = await ctx.projectsService.userOwnsProject({
			userId: ctx.user.id,
			projectId: projectId,
		});

		if (!userOwnsProject) {
			throw projectNotFound();
		}

		const successUrl = buildFrontendUrl({
			path: "/dashboard",
			query: {
				projectId: projectId,
				newTokens: tokenAmount.toString(),
			},
		});

		const paymentMetadata: TokenCheckoutMetadataType = {
			project_id: projectId,
			token_amount: tokenAmount,
		} as const;

		const session = await stripe.checkout.sessions.create({
			payment_method_types: ["card"],
			mode: "payment",
			customer: ctx.user.stripe_customer_id,
			success_url: successUrl,
			metadata: paymentMetadata,
			line_items: [
				{
					quantity: 1,
					price_data: {
						currency: "usd",
						product_data: {
							name: `${input.amount} Sweetreply tokens`,
						},
						unit_amount: projectConstants.token_price * 100 * input.amount, // converts to cents as an integer
					},
				},
			],
		});

		return {
			checkoutUrl: session.url,
		};
	});
