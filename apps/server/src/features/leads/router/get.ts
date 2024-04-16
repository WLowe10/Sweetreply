import { authenticatedProcedure } from "@/trpc";
import { z } from "zod";
import { leadNotFound } from "../errors";

export const getLeadInputSchema = z.object({
	id: z.string().uuid(),
});

export const getLeadHandler = authenticatedProcedure
	.input(getLeadInputSchema)
	.query(async ({ input, ctx }) => {
		const lead = await ctx.prisma.lead.findFirst({
			where: {
				id: input.id,
			},
		});

		if (!lead) {
			throw leadNotFound();
		}

		const userOwnsProject = await ctx.projectsService.userOwnsProject({
			userId: ctx.user.id,
			projectId: lead.project_id,
		});

		if (!userOwnsProject) {
			throw leadNotFound();
		}

		return lead;
	});
