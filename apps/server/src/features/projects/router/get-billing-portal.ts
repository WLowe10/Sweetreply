import { authenticatedProcedure } from "@/trpc";
import { z } from "zod";
import { projectNotFound } from "../errors";

const getBillingPortalInputSchema = z.object({
	project_id: z.string(),
});

export const getBillingPortalHandler = authenticatedProcedure
	.input(getBillingPortalInputSchema)
	.query(async ({ input, ctx }) => {
		const projectId = input.project_id;

		const userOwnsProject = await ctx.projectsService.userOwnsProject({
			userId: ctx.user.id,
			projectId: projectId,
		});

		if (!userOwnsProject) {
			throw projectNotFound();
		}

		// const billingPortal = await ctx.stripe.billingPortal.sessions.create({

		// })
	});
