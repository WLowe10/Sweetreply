import { authenticatedProcedure } from "@auth/procedures";
import { buyTokensInputSchema } from "@sweetreply/shared/features/projects/schemas";
import { getTokensPrice } from "@sweetreply/shared/features/projects/utils";
import { buildFrontendUrl } from "@lib/utils";
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

		const session = await ctx.stripe.checkout.sessions.create({
			payment_method_types: ["card"],
			mode: "payment",
			customer_email: ctx.user.email,
			success_url: successUrl,
			metadata: paymentMetadata,
			line_items: [
				{
					quantity: 1,
					price_data: {
						currency: "usd",
						product_data: {
							name: `${input.amount} Sweetreply tokens`,
							description: `${input.amount} tokens to use on Sweetreply`,
						},
						unit_amount: Math.floor(getTokensPrice(tokenAmount) * 100),
					},
				},
			],
		});

		return {
			checkoutUrl: session.url,
		};
	});
