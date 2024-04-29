import { openAI } from "@lib/client/openai";
import { replyPrompt } from "../prompts/reply-prompt";
import { LeadPlatformType, ReplyCharacterLimit } from "@sweetreply/shared/features/leads/constants";
import type { Lead, Project } from "@sweetreply/prisma";

export const replyCompletion = async ({
	lead,
	project,
}: {
	lead: Lead;
	project: Project;
}): Promise<string> => {
	const replyCharacterLimit = ReplyCharacterLimit[lead.platform as LeadPlatformType];
	const maxTokens =
		typeof replyCharacterLimit === "number" ? Math.ceil(replyCharacterLimit / 4) : 1250;

	const prompt = replyPrompt({ project, lead, characterLimit: replyCharacterLimit });

	const completion = await openAI.chat.completions.create({
		model: "gpt-3.5-turbo",
		temperature: 1,
		max_tokens: maxTokens,
		messages: [
			{
				role: "user",
				content: prompt,
			},
		],
	});

	let replyText = completion.choices[0].message.content as string;

	replyText = replyText.trim();

	if (replyText.length < 10) {
		throw new Error("Generated reply is too short");
	}

	if (replyText.length > replyCharacterLimit) {
		throw new Error("Generated reply is too long for the lead's platform");
	}

	const firstChar = replyText.charAt(0);
	const lastChar = replyText.charAt(replyText.length - 1);

	// sometimes the prompts include quotes, so we need to remove them
	if (firstChar === lastChar && (firstChar === `'` || firstChar === '"')) {
		replyText = replyText.slice(1, -1);
	}

	return replyText;
};
