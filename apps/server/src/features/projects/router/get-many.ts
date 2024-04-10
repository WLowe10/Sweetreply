import { authenticatedProcedure } from "@/trpc";

export const getManyProjectsHandler = authenticatedProcedure.query(({ ctx }) => {
	return ctx.prisma.project.findMany({
		where: {
			user_id: ctx.user.id,
		},
	});
});
