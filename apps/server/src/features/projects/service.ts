import { prisma } from "@lib/db";
import type { Project } from "@sweetreply/prisma";

export class ProjectsService {
	public getProject(projectId: string) {
		return prisma.project.findUnique({
			where: {
				id: projectId,
			},
		});
	}

	public async userOwnsProject({
		userId,
		projectId,
	}: {
		userId: string;
		projectId: string;
	}): Promise<Project | null> {
		// const user = await authService.getUser(userId);

		// if (!user) {
		// 	return null;
		// }

		const project = await prisma.project.findFirst({
			where: {
				id: projectId,
				user_id: userId,
			},
		});

		return project;
	}
}

export const projectsService = new ProjectsService();
