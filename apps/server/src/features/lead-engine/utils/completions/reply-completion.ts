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

	const { system, user } = replyPrompt({ project, lead, characterLimit: replyCharacterLimit });

	// openai

	const completion = await openAI.chat.completions.create({
		// model: "gpt-4-turbo", // replies seem to be a lot better, but not worth the insance price
		model: "gpt-3.5-turbo",
		temperature: 0.85,
		max_tokens: maxTokens,
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

	let replyText = completion.choices[0].message.content as string;

	// ollama

	// const response = await ollama.chat({
	// 	model: "llama3",
	// 	options: {
	// 		temperature: 1,
	// 	},
	// 	messages: [
	// 		{
	// 			role: "system",
	// 			content: system,
	// 		},
	// 		{
	// 			role: "user",
	// 			content: user,
	// 		},
	// 	],
	// });

	// let replyText = response.message.content;

	//

	// replicate

	// const replicate = new Replicate({
	// 	auth: "api key",
	// });

	// const result = await replicate.run("meta/llama-2-70b-chat", {
	// 	input: {
	// 		top_k: 0,
	// 		top_p: 1,
	// 		temperature: 1,
	// 		system_prompt: system,
	// 		prompt: user,
	// 		length_penalty: 1,
	// 		max_new_tokens: 500,
	// 		min_new_tokens: -1,
	// 		prompt_template: "<s>[INST] <<SYS>>\n{system_prompt}\n<</SYS>>\n\n{prompt} [/INST]",
	// 		presence_penalty: 0,
	// 	},
	// });

	// let replyText = result.join("");

	//

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
