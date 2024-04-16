import Queue from "bull";
import { env } from "@/env";
import { openAI } from "@/lib/client/openai";
import { prisma } from "@/lib/db";
import { replyPrompt } from "../utils/prompts/reply-prompt";
import { generateReplyCompletion } from "../utils/generate-reply-completion";

export type GenerateReplyQueueJobData = {
	lead_id: string;
};

const generateReplyQueue = new Queue<GenerateReplyQueueJobData>("generate-reply", {
	redis: env.REDIS_URL,
});

generateReplyQueue.process(async (job) => {
	const jobData = job.data;

	const lead = await prisma.lead.findUnique({
		where: {
			id: jobData.lead_id,
		},
	});

	if (!lead) {
		throw new Error("Lead not found");
	}

	const project = await prisma.project.findUnique({
		where: {
			id: lead.project_id,
		},
	});

	if (!project) {
		throw new Error("Lead not found");
	}

	const result = await generateReplyCompletion({ lead, project });

	console.log(result);
});

export { generateReplyQueue };
