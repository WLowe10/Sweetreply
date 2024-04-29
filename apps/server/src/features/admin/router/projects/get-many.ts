import { adminProcedure } from "@features/admin/procedures";

export const getManyProjectsHandler = adminProcedure.query(async ({ ctx }) => {
	const projectCount = await ctx.prisma.project.count();
	const projects = await ctx.prisma.project.findMany();

	return {
		total: projectCount,
		data: projects,
	};
});
