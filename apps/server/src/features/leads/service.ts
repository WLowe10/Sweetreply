import { prisma } from "@lib/db";

export async function userOwnsLead({ userID, leadID }: { userID: string; leadID: string }) {
	return await prisma.lead.findUnique({
		where: {
			id: leadID,
			project: {
				user_id: userID,
			},
		},
		include: {
			project: true,
		},
	});
}
