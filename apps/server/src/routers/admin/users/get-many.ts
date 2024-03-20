import { adminProcedure } from "@/trpc";

export const getManyUsersHandler = adminProcedure.query(({ ctx }) => {
	return ctx.prisma.user.findMany();
});
