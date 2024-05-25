import { prisma } from "@lib/prisma";

export async function userOwnsProject({
	projectID,
	userID,
}: {
	projectID: string;
	userID: string;
}) {
	const project = await prisma.project.findFirst({
		where: {
			id: projectID,
			user_id: userID,
		},
	});

	return project;
}
