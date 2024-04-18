import { z } from "zod";
import { openAI } from "@/lib/client/openai";
import { replyPrompt } from "./prompts/reply-prompt";
import type { Lead, Project } from "@sweetreply/prisma";

const replyPromptOutputSchema = z.object({
	shouldReply: z.boolean(),
	reply: z.string().optional(),
});

export type ReplyPromptOutput = z.infer<typeof replyPromptOutputSchema>;

export const generateReplyCompletion = async ({
	lead,
	project,
}: {
	lead: Lead;
	project: Project;
}) => {
	const prompt = replyPrompt({ project, lead });

	console.log(prompt);

	const completion = await openAI.chat.completions.create({
		model: "gpt-3.5-turbo",
		temperature: 0.7, // ? experiementng
		messages: [
			{
				role: "user",
				content: prompt,
			},
		],
	});

	let resultObj;

	try {
		resultObj = JSON.parse(completion.choices[0].message.content as string);
	} catch (err) {
		throw new Error("Failed to parse completion");
	}

	return replyPromptOutputSchema.parse(resultObj);
};
