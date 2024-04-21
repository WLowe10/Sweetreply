import { authenticatedProcedure } from "@/trpc";
import { projectNotFound } from "../errors";
import { buildFrontendUrl } from "@/lib/utils";
import { z } from "zod";

const subscribeInputSchema = z.object({
	project_id: z.string(),
});

export const subscribeHandler = authenticatedProcedure
	.input(subscribeInputSchema)
	.mutation(async ({ input, ctx }) => {
		const projectId = input.project_id;

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
				plan: "hobby",
				success: "true",
			},
		});

		const sessionMetadata = {
			project_id: projectId,
		};

		const checkout = await ctx.stripe.checkout.sessions.create({
			mode: "subscription",
			payment_method_types: ["card"],
			customer_email: ctx.user.email,
			metadata: sessionMetadata,
			success_url: successUrl,
			consent_collection: {
				terms_of_service: "required",
			},
			line_items: [
				{
					price: "price_1P86HsHocvto7IFTzXUaMMAn",
					quantity: 1,
				},
			],
		});

		return {
			checkoutUrl: checkout.url,
		};
	});
