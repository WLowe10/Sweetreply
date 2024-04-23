import { emailService } from "@/email/service";
import { prisma } from "@/lib/db";
import type { Project } from "@sweetreply/prisma";
import { P } from "pino";

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

	public async deductReplyCredit(projectId: string): Promise<void> {
		const project = await this.getProject(projectId);

		if (!project) {
			return;
		}

		const updatedUser = await prisma.user.update({
			where: {
				id: project.user_id,
			},
			data: {
				reply_credits: {
					decrement: 1,
				},
			},
		});

		if (updatedUser.reply_credits === replyCreditAlertLevel) {
			// todo update email to replies
			// emailService.sendLowOnTokens({
			// 	to: updatedUser.email,
			// 	data: {
			// 		firstName: updatedUser.first_name,
			// 	},
			// });
		}
	}
}

export const projectsService = new ProjectsService();
