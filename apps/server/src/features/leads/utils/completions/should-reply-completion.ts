import { shouldReplyPrompt, type ShouldReplyPromptData } from "../prompts/should-reply-prompt";
import { openAI } from "@lib/client/openai";
import { z } from "zod";

const shouldReplyOutputSchema = z.boolean();

export type ShouldReplyOutputType = z.infer<typeof shouldReplyOutputSchema>;

export const shouldReplyCompletion = async ({
	lead,
	project,
}: ShouldReplyPromptData): Promise<ShouldReplyOutputType> => {
	const { system, user } = shouldReplyPrompt({ lead, project });

	const completion = await openAI.chat.completions.create({
		model: "gpt-3.5-turbo",
		temperature: 0.1,
		messages: [
			{
				role: "system",
				content: system,
			},
			{
				role: "user",
				content: user,
			},
		],
	});

	try {
		return shouldReplyOutputSchema.parse(
			JSON.parse((completion.choices[0].message.content as string).toLowerCase())
		);
	} catch (err) {
		throw new Error("Failed to parse completion");
	}
};
