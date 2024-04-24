import { openAI } from "@/lib/client/openai";
import { replyPrompt, type ReplyPromptData } from "../prompts/reply-prompt";

export const replyCompletion = async ({ lead, project }: ReplyPromptData): Promise<string> => {
	const prompt = replyPrompt({ project, lead });

	const completion = await openAI.chat.completions.create({
		model: "gpt-3.5-turbo",
		temperature: 1, // ? experiementng
		messages: [
			{
				role: "user",
				content: prompt,
			},
		],
	});

	return completion.choices[0].message.content as string;
};
