import { authenticatedProcedure } from "@features/auth/procedures";

export const getManyProjectsHandler = authenticatedProcedure.query(({ ctx }) => {
	return ctx.prisma.project.findMany({
		where: {
			user_id: ctx.user.id,
		},
	});
});
