import { emailService } from "@/email/service";
import { prisma } from "@/lib/db";
import type { Project } from "@sweetreply/prisma";

const replyCreditAlertLevel = 10;

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

	public async deductReplyCredit(projectId: string) {
		const updatedProject = await prisma.project.update({
			where: {
				id: projectId,
			},
			data: {
				reply_credits: {
					decrement: 1,
				},
			},
		});

		if (updatedProject.reply_credits === replyCreditAlertLevel) {
			const owner = await prisma.user.findUnique({
				where: {
					id: updatedProject.user_id,
				},
			});

			if (owner) {
				// todo update email to replies
				emailService.sendLowOnTokens({
					to: owner.email,
					data: {
						firstName: owner.first_name,
						projectId: updatedProject.id,
						projectName: updatedProject.name,
					},
				});
			}
		}

		return updatedProject;
	}
}

export const projectsService = new ProjectsService();
