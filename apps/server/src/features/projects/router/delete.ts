import { authenticatedProcedure } from "@/trpc";
import { baseProjectSchema } from "@sweetreply/shared/features/projects/schemas";
import { z } from "zod";

const deleteProjectInputSchema = z.object({
	id: baseProjectSchema.shape.id,
});

export const deleteProjectHandler = authenticatedProcedure
	.input(deleteProjectInputSchema)
	.mutation(({ input, ctx }) => {
		return ctx.prisma.project.delete({
			where: {
				id: input.id,
				user_id: ctx.user.id,
			},
		});
	});
